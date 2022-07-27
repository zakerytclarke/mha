export class MentalHealthSDK {
	constructor(config) {
		this.config = {
            study_id:"default",
            refresh_timeout:5*60*1000
        };
		this.datasrc = [];
		
	}
    _init_sensors(){
        navigator.getBattery().then((data) => {
            this._save_data
        })
	}
    _save_database(){

    }

    _load_database(){
        
    }

    _save_data(params,update){
        t
	}
	features(params,update){
	
	}
	
}

class MushroomDB_Database(){
	constructor(socket) {
		this.database = [];
	}
	_load_db(){

	}
	_save_db(){

	}

	find(table,params){

	}

	_sendMessage(data) {
		this.broadcast.emit("mushroomdb",data);
	}
}
