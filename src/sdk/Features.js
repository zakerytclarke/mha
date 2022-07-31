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

function group_by(fg, domain){

}

function average(fg, domain,data){
   var data = fg(domain,data);
   var stats = [];
   //Compute average for every feature
   data.map(function(x){

   });
   return [];
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
   min_time:10*60*1000,//10 minutes
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

   return clusters;
}

export function time_at_gps_cluster(domain,data){
   var clusters = gps_clusters(domain,data);
   for(var i=0;i<clusters.length;i++){
      clusters[i].min_time_at_location=clusters[i].ts_end-clusters[i].ts_start;
      clusters[i].max_time_at_location=(clusters[i+1]||clusters[i]).ts_start-clusters[i].ts_start;
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
   return [poi[0]]
}

export function work_location(domain,data){
   var home = home_location(domain,data)[0];
   var poi = poi_gps_cluster(domain,data);
   //Second most visited location not near home
   return [poi.filter(x=>distance(home,x)>CLUSTER_SETTINGS.max_distance)[0]]
}