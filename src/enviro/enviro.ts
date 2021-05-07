///
///	IMPORTANT ALL THE EXPORTS IS READONY FOR APPLICATION
/// RESULT AS SNAPSHOT FOR process.env ,  goal - decouple 
/// PROCESS ENV AND APPLICATION !!!!
///

import * as dotenv from 'dotenv';



export var PORT: number = 3000;
export var DB_SCHEMA: string = 'public';

export var DB_CONNECTION_STRING = '';
export var IS_HEROKU: boolean = false;;
export var TO_LOG_RESPONSE: boolean = true;;
export var TO_LOG_RESPONSE_DATA: boolean = true;
export var TO_LOG_SQL: boolean = true;
export var Pool: pg.Pool = undefined;


function isTrue(str: string) {
	str = str?.toUpperCase() || '';
	return str === 'YES' || str === '1' || str === 'TRUE';
}



export function envConfig()    {
	//IMPOT : Normalization of the Port Instance
	const port0 = process.env.PORT;
	dotenv.config();
	//First of all External port , after tgis in .env after 3000
	process.env.PORT = port0 || process.env.PORT || '3000';
	process.env.DB_SCHEMA = process.env.DB_SCHEMA || 'public';

	process.env.DB_CONNECTION_STRING = process.env.DATABASE_URL ||
		process.env.POSTGRESS_LOCAL_CONNECTION_STRING;

	const is_heroku: boolean = (process.env.IS_HEROKU == 'YES') ||
		(!process.env.IS_HEROKU && !process.env.POSTGRESS_LOCAL_CONNECTION_STRING);
	process.env.IS_HEROKU = (is_heroku) ? 'YES' : 'NO';

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	fixingEnv();

	

}

function fixingEnv() {
	PORT = +process.env.PORT;
	DB_SCHEMA = process.env.DB_SCHEMA;
	DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
	IS_HEROKU = isTrue(process.env.IS_HEROKU);
	TO_LOG_SQL = isTrue(process.env.TO_LOG_SQL);
	TO_LOG_RESPONSE = isTrue(process.env.TO_LOG_RESPONSE);
	TO_LOG_RESPONSE_DATA = isTrue(process.env.TO_LOG_RESPONSE_DATA);
	console.log(`IS_HEROKU::${IS_HEROKU}::Env(DB_:: ${DB_CONNECTION_STRING})`);
	console.log(`printenv :NODE_TLS_REJECT_UNAUTHORIZED=${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`);
	//createPool();

}

import * as pg from 'pg';
export function set_Pool(pool: pg.Pool) {
	Pool = pool;
}

//export function createPool(): pg.Pool {
//		return Pool;

//}
