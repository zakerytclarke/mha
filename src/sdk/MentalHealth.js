export class MentalHealthSDK {
	constructor(config) {
		this.config = {
            study_id:"default",
            refresh_timeout:1000,
            surveys:[],
            suggestions:[
                {
                    'title':"Sleep and Health",
                    'text':"Make sure to get at least 6-8 hrs sleep tonight!"
                }
            ]
        };
		this.datasrc = [];
        this._load_database()
		this._init_sensors()
	}
    _init_sensors(){
        setInterval(()=>{this._data_loop()},this.config.refresh_timeout)
	}
    _data_loop(){
        var self = this;
        // navigator.getBattery().then((data) => {
        //     self._save_data("battery",{
        //         charging:data.charging,
        //         batterylife:data.dischargingTime,
        //         level:data.level
        //     })
        // })
        // navigator.geolocation.getCurrentPosition((data) => {
        //     self._save_data("gps",{
        //         "latitude":data.coords.latitude,
        //         "longitude":data.coords.longitude,
        //         "altitude":data.coords.altitude,
        //         "accuracy":data.coords.accuracy
        //     })
        // })
        navigator.geolocation.getCurrentPosition((data) => {
            console.log(data)
            
        })
    }
    _save_database(){
        localStorage.setItem("mha_raw", JSON.stringify(this.datasrc))
    }

    _load_database(){
        this.datasrc = JSON.parse(localStorage.getItem("mha_raw")||"[]")
    }

    _save_data(label, data){
        console.log(data);
        this.datasrc.push({
            'type':label,
            'ts':(new Date()).getTime(),
            'data':data
        })
        this._save_database()
	}
	features(params,update){
	
	}
	
}

