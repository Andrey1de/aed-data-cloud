import { StoreDto } from './store-dto';
import * as  Env  from '../enviro/enviro';

const DB_SCHEMA = Env.DB_SCHEMA;

class SqlFactoryClass {

    constructor() {

    }
    Get(table: string, kind: string, key: string = undefined!): string {
        let sql = `SELECT kind, key, jdata, guid, status, stored, store_to FROM ${DB_SCHEMA}.${table} `;
     
        if (!(kind.toLocaleLowerCase() == 'all' && !key)) {

            sql += `WHERE kind='${kind}'`;
            if(key) {
                sql += ` AND key='${key}' `
            }

		}
        sql += ';';
        return sql;
    }
    Delete(table: string, kind: string, key: string = undefined!): string {

        let sql = `DELETE FROM ${DB_SCHEMA}.${table} `;
        if (!(kind.toLocaleLowerCase() == 'all' && !key)) {

            sql += `WHERE kind='${kind}'`;
            if(key) {
                sql += ` AND key='${key}' `
            }

		}
        
        sql += ' RETURNING *;';
        return sql;

    }


    UpsertRow(table: string, row: StoreDto): string {
        const store_to = (row.store_to) ?
            `'${row.store_to.toISOString()}'` : 'DEFAULT';
        const jdata = JSON.stringify(row.jdata || '{}');
        const sql =

            `
INSERT INTO ${DB_SCHEMA}.${table}(
	 kind, key, store_to, jdata)
	VALUES ('${row.kind}','${row.key}',${store_to},'${jdata}')
ON CONFLICT(kind, key) DO UPDATE SET
	stored = now(),
	jdata = EXCLUDED.jdata,
	store_to = EXCLUDED.store_to,
	status = 1 
RETURNING *;
`

        return sql;
    }
    InsertRow(table: string, row: StoreDto): string {
        const store_to = (row.store_to) ?
            `'${row.store_to.toISOString()}'` : 'DEFAULT';
        const jdata = JSON.stringify(row.jdata || '{}');
        const sql =

            `
INSERT INTO ${DB_SCHEMA}.${table}(
	 kind, key, store_to, jdata)
	VALUES ('${row.kind}','${row.key}',${store_to},'${jdata}')
RETURNING *;
`

        return sql;
    }


    UpdateRow(table: string, row: StoreDto): string {
        const store_to = (row.store_to) ?
            `'${row.store_to.toISOString()}'` : "DEFAULT";
        const jdata = JSON.stringify(row.jdata || '{}');
        const sql =
            
`UPDATE ${DB_SCHEMA}.${table} SET ` +
    `stored=now(), ` +
    `store_to=${store_to}, ` +
    `jdata=${jdata} ` +
`WHERE kind='${row.kind}' AND key='${row.key}' ` +
`RETURNING * ;`

        return sql;

    }

}

export const SqlFactory: SqlFactoryClass = new SqlFactoryClass();
