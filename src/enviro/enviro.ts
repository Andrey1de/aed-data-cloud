///
///	IMPORTANT ALL THE EXPORTS IS READONY FOR APPLICATION
/// RESULT AS SNAPSHOT FOR process.env ,  goal - decouple 
/// PROCESS ENV AND APPLICATION !!!!
///
import  * as pg  from 'pg';
import * as dotenv from 'dotenv';
const VERSION = '1.2.1';
function isTrue(str: string) {
	str = str?.toUpperCase() || '';
	return str === 'YES' || str === '1' || str === 'TRUE';
}
process.env.Port = process.env.Port || '80';

class EnvClass {
	get VERSION(): string { return VERSION;}
	get PORT() : number {return +process.env.Port ; }
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
		process.env.VERSION = this.VERSION;
		process.env.LOG_RESPONSE = 'YES';
		process.env.LOG_RESPONSE_DATA = 'YES';
		process.env.LOG_SQL = 'YES'; 
	}

	config(){

		let env = process.env;
		const port0 = env.PORT;
		dotenv.config();
		//First of all External port , after tgis in .env after 3000
		env.PORT = port0 || env.PORT || '3000';
		env.DB_SCHEMA = env.DB_SCHEMA || 'public';
	
		env.DB_CONNECTION_STRING = env.DATABASE_URL ||
			env.POSTGRESS_LOCAL_CONNECTION_STRING;
	
		const is_heroku: boolean = (env.IS_HEROKU == 'YES') ||
			(!env.IS_HEROKU && !env.POSTGRESS_LOCAL_CONNECTION_STRING);
		env.IS_HEROKU = (is_heroku) ? 'YES' : 'NO';
	
		env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	
		console.log('//BEG ===== ENVIROMENT VARIAVLES  =======================');
		console.log(this.dump());
		console.log('//END ===== ENVIROMENT VARIAVLES  =======================');

	}

	dbConnect() : pg.Pool {
       
		if (Env.DB_CONNECTION_STRING && !this._Pool) {

			if (Env.IS_HEROKU) {
				pg.defaults.ssl = true;
			}

			this._Pool = new pg.Pool({
				connectionString: Env.DB_CONNECTION_STRING,
				max: 20,
				idleTimeoutMillis: 30000,
				connectionTimeoutMillis: 20000,

			});
			this._Pool.on("connect", p => {
				console.log(`Postgres Pool connected ${Env.DB_CONNECTION_STRING}`)
			})
			this._Pool.on("error", p => {
				console.error(p);
			});
		}

		return this._Pool;
		console.log(`Connection Pool is set to \n${Env.DB_CONNECTION_STRING}`);
	}

	dump(): string {
		  let env = process.env;
		let str =
`
VERSION = ${this.VERSION}
PORT = ${this.PORT}
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
 export const Env = new EnvClass()




