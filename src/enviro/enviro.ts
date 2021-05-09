///
///	IMportANT ALL THE EXportS IS READONY FOR APPLICATION
/// RESULT AS SNAPSHOT FOR process.env ,  goal - decouple 
/// PROCESS ENV AND APPLICATION !!!!
///
import  * as pg  from 'pg';
import * as dotenv from 'dotenv';
import * as EX from 'express';
const VERSION = '1.2.1';
function isTrue(str: string) {
	str = str?.toUpperCase() || '';
	return str === 'YES' || str === '1' || str === 'TRUE';
}



class EnviroClass {
	get VERSION(): string { return VERSION;}
	get port(): string { return process.env.port; }
	get DB_SCHEMA() : string  {return process.env.DB_SCHEMA ; }
	
	get DB_CONNECTION_STRING(): string { return process.env.DB_CONNECTION_STRING ; }
	get IS_HEROKU() : boolean  {return isTrue(process.env.IS_HEROKU) ; }
	//bit 4
	get LOG_RESPONSE() : boolean  {return isTrue(process.env.LOG_RESPONSE) ;}
	
	//bit 2
	get LOG_RESPONSE_DATA() : boolean 
		{ return isTrue(process.env.LOG_RESPONSE_DATA);}
	//bit 1
	get LOG_SQL() : boolean { return isTrue(process.env.LOG_SQL);}
	get Pool() : pg.Pool {return this._Pool;}
	protected _Pool: pg.Pool = undefined;


	constructor() {
	}

	config(){
	
		process.env.VERSION = this.VERSION;
		process.env.LOG_RESPONSE = 'YES';
		process.env.LOG_RESPONSE_DATA = 'YES';
		process.env.LOG_SQL = 'YES';
	//const env = process.env;
		//console.log(`@@@ Zero Port ${process.env.port} @@@`);
		//const port0 = Enviro.port;
		//dotEnviro.config();
		////First of all External port , after tgis in .env after 3000
		//Enviro.port = port0 || Enviro.port || '8080';
		//Enviro.DB_SCHEMA = Enviro.DB_SCHEMA || 'public';
	
		//Enviro.DB_CONNECTION_STRING = Enviro.DATABASE_URL ||
		//	Enviro.POSTGRESS_LOCAL_CONNECTION_STRING;
	
		//const is_heroku: boolean = (Enviro.IS_HEROKU == 'YES') ||
		//	(!Enviro.IS_HEROKU && !Enviro.POSTGRESS_LOCAL_CONNECTION_STRING);
		//Enviro.IS_HEROKU = (is_heroku) ? 'YES' : 'NO';
	
		//Enviro.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	
		//console.log('//BEG ===== ENVIROMENT VARIAVLES  =======================');
		//console.log(this.dump());
		//console.log('//END ===== ENVIROMENT VARIAVLES  =======================');

	}

	dbConnect() : pg.Pool {
       
		if (Enviro.DB_CONNECTION_STRING && !this._Pool) {

			if (Enviro.IS_HEROKU) {
				pg.defaults.ssl = true;
			}

			this._Pool = new pg.Pool({
				connectionString: Enviro.DB_CONNECTION_STRING,
				max: 20,
				idleTimeoutMillis: 30000,
				connectionTimeoutMillis: 20000,

			});
			this._Pool.on("connect", p => {
				console.log(`Postgres Pool connected ${Enviro.DB_CONNECTION_STRING}`)
			})
			this._Pool.on("error", p => {
				console.error(p);
			});
		}

		return this._Pool;
		console.log(`Connection Pool is set to \n${Enviro.DB_CONNECTION_STRING}`);
	}

	dump(): string {
		  let env = process.env;
		let str =
`
VERSION = ${this.VERSION}
PORT = ${this.port}
DB_SCHEMA = ${this.DB_SCHEMA}
DB_CONNECTION_STRING = ${this.DB_CONNECTION_STRING}
IS_HEROKU = ${this.IS_HEROKU}
LOG_RESPONSE = ${this.LOG_RESPONSE}
LOG_RESPONSE_DATA = ${this.LOG_RESPONSE_DATA}
LOG_SQL = ${this.LOG_SQL}
NODE_TLS_REJECT_UNAUTHORIZED=${env.NODE_TLS_REJECT_UNAUTHORIZED}
` ;
		return str;
	}


	
}
 export const Enviro = new EnviroClass()




