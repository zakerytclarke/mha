import * as Features from "./Features.js"

export class MentalHealthSDK {

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
        this.uuid = null;
		this.computed_features = {};
        this.callback=function(cf){};
        this._load_database()
        if(this.datasrc.length>0){
            this.uuid=this.datasrc[0].id;
        }else{//Create new uuid
            this.uuid=crypto.randomUUID();
        }
        console.log(this.uuid)
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
            'id':this.uuid,
            'data':data
        })
        this._save_database()
	}
    clear_database(){
        this.datasrc = []
        this._save_database()
    }

    register_callback(fn){
        this.callback = fn;
    }

    compute_features(domain){
        if(!domain){
            domain = {ts_start:0,ts_end:(new Date()).getTime()}; 
        } 
        
        var features_to_compute = [Features.raw_data,Features.phq_surveys,Features.gps_data,Features.poi_gps_cluster,Features.home_location,Features.work_location,Features.surveys_to_display,Features.depression_score];
        var features = {};
        features_to_compute.map((fs)=>{
            features[fs.name]=this.compute_feature(fs,domain);
        });
        this.computed_features=features;
        console.log(features);
        //Callback features updated
        this.callback(this.computed_features)
    }
    compute_feature(feature, domain){
        
        return feature(domain,this.datasrc);
    }
	
}
