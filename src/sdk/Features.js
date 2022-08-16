/**
 * Helper Functions
 * 
 */


function memoize(fg,domain){
   var cache = {};
   var k = JSON.stringify(domain);
   if(cache[k]){
      return cache[k]
   }else{
      return fg(domain);
   }
}

export function group_by(fg, domain, data){
   var data = fg(domain,data);
   var out = {};
   for(var i in data){
      var dp = data[i];
      for(var key in dp){
         if(key in out){
            out[key].push(dp[key]);
         }else{
            out[key] = [dp[key]];
         }
      }
   }
   return out;
}

export function average(fg, domain, data){
   var data = group_by(fg,domain,data);
   for(var key in data){
      data[key] = data[key].reduce((acc, c) => acc + c, 0)/data[key].length;
   }
   return data;
}

export function median(fg, domain, data){
   var data = group_by(fg,domain,data);
   for(var key in data){
      data[key] = data[key][Math.floor(data[key.length]/2)];
   }
   return data;
}

function feature_by_day(fg,domain,data){
   return fg({
      ts_start:domain.ts_end.setUTCHours(0,0,0,0).getTime(),
      ts_end:domain.ts_end.setUTCHours(23,59,59,999).getTime()
   },data)
}

export function raw_data(domain,data){
   return data.filter(x => (domain.ts_start||0)<x.ts && x.ts<(domain.ts_end||Math.Infinity))
}

export function battery_data(domain,data){
   return raw_data(domain,data).filter(x=>x.type=="battery");
}

export function battery_level(domain,data){
   return battery_data(domain,data).map(x=>({ts:x.ts,battery_level:x.data.level}));
}

export function average_battery_level(domain,data){
   return average(battery_level,domain,data);
}


export function gps_data(domain,data){
   return raw_data(domain,data).filter(x=>x.type=="gps").map(x=>({ts:x.ts,latitude:x.data.latitude,longitude:x.data.longitude,altitude:x.data.altitude,accuracy:x.data.accuracy}));
}

//Modified from https://www.geeksforgeeks.org/program-distance-two-points-earth/#:~:text=For%20this%20divide%20the%20values,is%20the%20radius%20of%20Earth.
function distance(c1,c2){
   let lon1 = c1.longitude * Math.PI / 180;
   let lon2 = c2.longitude * Math.PI / 180;
   let lat1 = c1.latitude * Math.PI / 180;
   let lat2 = c2.latitude * Math.PI / 180;
   
   // Haversine formula
   let dlon = lon2 - lon1;
   let dlat = lat2 - lat1;
   let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2),2);
                
   let c = 2 * Math.asin(Math.sqrt(a));
    
   // Radius of earth in meters
   let r = 6371000;
    
   return(c * r);
}

const CLUSTER_SETTINGS = {
   max_distance:100,
   min_time:15*60*1000,//15 minutes
}
//If previous and next point are withing a given distance of the current cluster, we classify as the mean of all current points
export function gps_clusters(domain,data){
   var clusters = [];
   var gps_coords = gps_data(domain,data);
   
   var current_cluster = gps_coords[0];
   current_cluster.points = [gps_coords[0]];
   current_cluster.ts_start = gps_coords[0].ts;
   current_cluster.ts_end = gps_coords[0].ts;
   for(var i=1;i<gps_coords.length;i++){
      var coord = gps_coords[i];
      //Part of same cluster
      if(distance(coord,current_cluster) <= CLUSTER_SETTINGS.max_distance){
         current_cluster.points.push(coord);
         current_cluster.ts_start = Math.min(current_cluster.ts_start,coord.ts)
         current_cluster.ts_end = Math.max(current_cluster.ts_end,coord.ts);
         //TODO move lat/long to be average of all points
      }else{//New cluster
         clusters.push(current_cluster);

         current_cluster = coord;
         current_cluster.points = [coord];
         current_cluster.ts_start = coord.ts;
         current_cluster.ts_end = coord.ts;
      }

   }
   clusters.push(current_cluster);

   return clusters;
}

export function time_at_gps_cluster(domain,data){
   var clusters = gps_clusters(domain,data);
   for(var i=0;i<clusters.length;i++){
      clusters[i].min_time_at_location=clusters[i].ts_end-clusters[i].ts_start;
      clusters[i].max_time_at_location=Math.max(clusters[i].min_time_at_location,(clusters[i+1]||clusters[i]).ts_start-clusters[i].ts_start);
      clusters[i].time_at_location=clusters[i].max_time_at_location;
   }
   return clusters.sort((b,a)=>a.time_at_location-b.time_at_location);
}

export function type_gps_cluster(domain,data){
   var clusters = time_at_gps_cluster(domain,data);
   clusters.map(x=>{
      if(x.time_at_location <= CLUSTER_SETTINGS.min_time){
         x.cluster_type = "moving";
      }else{
         x.cluster_type = "stationary";
      }

   });
   return clusters;
}

export function poi_gps_cluster(domain,data){
   var clusters = type_gps_cluster(domain,data);
   return clusters.filter(x=>x.cluster_type=="stationary");
}

export function home_location(domain,data){
   var poi = poi_gps_cluster(domain,data);
   if(poi.length>0){
      return [poi[0]];
   }else{
      return [];
   }
}

export function work_location(domain,data){
   var home = home_location(domain,data)[0];
   var poi = poi_gps_cluster(domain,data);
   //Second most visited location not near home
   var filtered_poi =  poi.filter(x=>distance(home,x)>CLUSTER_SETTINGS.max_distance);
   if(filtered_poi.length>0){
      return [filtered_poi[0]];
   }else{
      return [];
   }
}


const surveys = {
   "mood":{
      title:"Mood Survey",
      offset:1*24*60*60*1000,//Every day
      questions:[
         {
            sid:"mood",
            id:"mood",
            text:"How are you feeling today?",
            type:"choice",
            answers:[
                "😔",
                "😐",
                "😊"
            ]
        },
   
      ],
   },
   "phq":{
      title:"PHQ Survey",
      offset:14*24*60*60*1000,//Every 2 weeks
      questions:[
         {
            sid:"phq",
            id:"phq_q1",
            text:"Over the last 2 weeks, how often have you been bothered by having little interest or please in doing things?",
            type:"choice",
            answers:[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
            ]
        },
        {
            sid:"phq",
            id:"phq_q2",
            text:"Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
            type:"choice",
            answers:[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
            ]
        },
        {
            sid:"phq",
            id:"phq_q3",
            text:"Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
            type:"choice",
            answers:[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
            ]
        },
        {
            sid:"phq",
            id:"phq_q4",
            text:"Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
            type:"choice",
            answers:[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
            ]
        },
        {
            sid:"phq",
            id:"phq_q5",
            text:"Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
            type:"choice",
            answers:[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
            ]
        },
        {
            sid:"phq",
            id:"phq_q6",
            text:"Over the last 2 weeks, how often have you been bothered by feeling bad about yourself?",
            type:"choice",
            answers:[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
            ]
        },
        {
            sid:"phq",
            id:"phq_q7",
            text:"Over the last 2 weeks, how often have you been bothered by trouble concentrating on things?",
            type:"choice",
            answers:[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
            ]
        },
        {
            sid:"phq",
            id:"phq_q8",
            text:"Over the last 2 weeks, how often have you been bothered by moving or speaking slowly?",
            type:"choice",
            answers:[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
            ]
        },
        {
            sid:"phq",
            id:"phq_q9",
            text:"Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or thoughts of hurting yourself in some way?",
            type:"choice",
            answers:[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
            ]
        },
   
      ]
   }
}



export function survey_data(domain,data){
   return raw_data(domain,data).filter(x=>x.type=="survey").map(x=>({ts:x.ts,sid:x.data.sid,id:x.data.id,answer:x.data.answer}));
}

export function mood_data(domain,data){
   return  survey_data(domain,data).filter(x=>x.sid=="mood");
}

export function phq_data(domain,data){
   return  survey_data(domain,data).filter(x=>x.sid=="phq").map(x=>{
      x.score = [
         "Not at all",
         "Several days",
         "More than half the days",
         "Nearly every day",
     ].indexOf(x.answer) 
      return x;
   });
}


export function phq_surveys(domain,data){
   var phq_surveys = phq_data(domain,data);
   var phq_labels = surveys.phq.questions.map(x=>x.id);
   var current = phq_labels.length-1;
   var current_survey = [];
   var out = [];
   for(var i=phq_surveys.length-1;i>=0;i--){
      if(phq_surveys[i].id==phq_labels[current]){  
         current_survey.unshift(phq_surveys[i]);
         current--;
         if(current<0){
            out.unshift({
               sid:"phq",
               questions:current_survey,
               score:current_survey.map(x=>x.score).reduce((b,a)=>a+b,0),
               ts:current_survey[0].ts
            })
            current = phq_labels.length-1;
            current_survey = [];
         }
      }

   }
   return out;
}

export function most_recent_phq(domain,data){
   var surveys = phq_surveys(domain,data);
   return [surveys[surveys.length-1]];
}

export function prev_phq(domain,data){
   var surveys = phq_surveys(domain,data);
   return [surveys[surveys.length-2]];
}

export function get_mood_question(domain,data){
   var mood_surveys = mood_data(domain,data);
   if(mood_surveys.length>0 && domain.ts_end-mood_surveys[mood_surveys.length-1].ts > surveys.mood.offset){
      return [surveys.mood.questions[0]];
   }
   return [];
}

export function get_phq_question(domain,data){
   var phq_surveys = phq_data(domain,data);
   switch((phq_surveys[phq_surveys.length-1]||{}).id){
      case undefined:
         return [surveys.phq.questions[0]];
      break;
      case "phq_q1":
         return [surveys.phq.questions[1]];
      break;
      case "phq_q2":
         return [surveys.phq.questions[2]];
      break;
      case "phq_q3":
         return [surveys.phq.questions[3]];
      break;
      case "phq_q4":
         return [surveys.phq.questions[4]];
      break;
      case "phq_q5":
         return [surveys.phq.questions[5]];
      break;
      case "phq_q6":
         return [surveys.phq.questions[6]];
      break;
      case "phq_q7":
         return [surveys.phq.questions[7]];
      break;
      case "phq_q8":
         return [surveys.phq.questions[8]];
      break;
      case "phq_q9":
         if(domain.ts_end-phq_surveys[phq_surveys.length-1].ts > surveys.phq.offset){
            return [surveys.phq.questions[0]]
         }
         return [];
      break;
   }

}

export function surveys_to_display(domain,data){
   return [...get_mood_question(domain,data),...get_phq_question(domain,data)]
}



//Depression, Anxiety, Bipolar Ratings
export function depression_score(domain,data){
   var phq = most_recent_phq(domain,data);
   var tmp = phq[0]||{ts:0,score:NaN};
   return [{ts:tmp.ts,score:1-tmp.score/27}]
}


//Suggestions
export function sucidality_suggestion(domain,data){
   var last_phq = depression_score(domain,data)[0];
   if(last_phq.score>20){
      return [{
         ts:domain.ts_end,
         suggestion:"If you are thinking about harming yourself or attempting suicide, tell someone who can help right away.\n         "
      }]
   }

}


export function suggestions_to_display(domain,data){

}