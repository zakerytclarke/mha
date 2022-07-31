import * as Features from "./Features.js"

export class MentalHealthSDK {
    surveys = {
        "mood":{
            title:"Mood Score",
            questions:[
                {
                    id:"mood",
                    text:"How are you feeling today?",
                    type:"choice",
                    answers:[
                        "😔",
                        "😐",
                        "😊"
                    ]
                },
            ]
        },
        "phq":{
            title:"PHQ 2",
            questions:[
                {
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
                    id:"phq_q9",
                    text:"Over the last 2 weeks, how often have you been bothered by moving or speaking slowly?",
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
    constructor(config) {
		this.config = {
            study_id:"default",
            refresh_timeout:1*60*1000,
            surveys:[],
            suggestions:[
                {
                    'title':"Sleep and Health",
                    'text':"Make sure to get at least 6-8 hrs sleep tonight!"
                }
            ]
        };
		this.datasrc = [];

		this.computed_features = {};
        this._load_database()
		this._init_sensors()
        this.compute_features();
	}
    _init_sensors(){
        this._data_loop();
        //Sensible way to do this setInterval(()=>{this._data_loop()},this.config.refresh_timeout)
        //Optimizing for keeping event loop active
        setInterval(()=>{this._data_loop()},this.config.refresh_timeout)
        let gyroscope = new window.Gyroscope({frequency: 1000/this.config.refresh_timeout});

        gyroscope.addEventListener('reading', (e) => {
            this._save_data("gyroscope",{
                x:gyroscope.x,
                y:gyroscope.y,
                z:gyroscope.z
            })
        });
        gyroscope.start();
	}
    _data_loop(){
        var self = this;
        navigator.getBattery().then((data) => {
            self._save_data("battery",{
                charging:data.charging,
                batterylife:data.dischargingTime,
                level:data.level
            })
        })

        navigator.geolocation.getCurrentPosition((data) => {
            self._save_data("gps",{
                "latitude":data.coords.latitude,
                "longitude":data.coords.longitude,
                "altitude":data.coords.altitude,
                "accuracy":data.coords.accuracy
            })
        })

    }
    _save_database(){
        localStorage.setItem("mha_raw", JSON.stringify(this.datasrc))
    }

    _load_database(){
        this.datasrc = JSON.parse(localStorage.getItem("mha_raw")||"[]")
    }

    _save_data(label, data){
        this.datasrc.push({
            'type':label,
            'ts':(new Date()).getTime(),
            'data':data
        })
        this._save_database()
	}
    clear_database(){
        this.datasrc = []
        this._save_database()
    }
    compute_features(){
        var domain = {ts_start:0,ts_end:(new Date()).getTime()};
        var features_to_compute = [Features.gps_data,Features.poi_gps_cluster,Features.home_location,Features.work_location];
        var features = {};
        features_to_compute.map((fs)=>{
            features[fs.name]=this.compute_feature(fs,domain);
        });
        this.computed_features=features;
        console.log(features);
    }
    compute_feature(feature, domain){
        var domain = {ts_start:0,ts_end:(new Date()).getTime()};
        return feature(domain,this.datasrc);
    }
	
}
