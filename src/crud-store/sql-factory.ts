import { StoreDto } from './store-dto';
import { Enviro }from '../enviro/enviro';



class SqlFactoryClass {
  
    constructor() {

    }

    normDate(that : any | undefined) : Date{
		if(that instanceof Date) that;
		return new Date(that);

	}

    // SELECT id, kind, key, jsonb, status, stored, store_to
	// FROM public.store;
    Get(table: string, kind: string, key: string = undefined!): string {
        let sql = 
`SELECT id, kind, key, jsonb, status, stored, store_to 
FROM ${Enviro.DB_SCHEMA}.${table} `;
     
        if (!(kind.toLowerCase() == 'all' && !key)) {

            sql += `WHERE kind='${kind}'`;
            if(key) {
                sql += ` AND key='${key}' `
            }
		}
        sql += ';';
        return sql;
    }
    Delete(table: string, kind: string, key: string = undefined!): string {

        let sql = `DELETE FROM ${Enviro.DB_SCHEMA}.${table} `;
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
            `'${this.normDate(row.store_to).toISOString()}'` : 'DEFAULT';
         const jsonb = JSON.stringify(row.jsonb) ;
         //TO ENCODE ????
        let sql : string;
        if(!!row.id) 
        {
sql = `INSERT INTO ${Enviro.DB_SCHEMA}.${table}(
    id, kind, key, jsonb , store_to)
    VALUES ('${row.id}','${row.kind}','${row.key}','${jsonb}',${store_to})
ON CONFLICT(kind, key) DO UPDATE SET
    stored = now(),
    id = EXCLUDED.id,
    jsonb = EXCLUDED.jsonb,
    store_to = EXCLUDED.store_to,
    status = 1 
RETURNING *;`          
        } 
        else 
        {
sql = `INSERT INTO ${Enviro.DB_SCHEMA}.${table}(
    kind, key, jsonb , store_to)
    VALUES ('${row.kind}','${row.key}','${jsonb}',${store_to})
ON CONFLICT(kind, key) DO UPDATE SET
    stored = now(),
    jsonb = EXCLUDED.jsonb,
    store_to = EXCLUDED.store_to,
    status = 1 
RETURNING *;`
        }
      
        return sql;
    }


    InsertRow(table: string, row: StoreDto): string {
        const store_to = (row.store_to) ?
            `'${this.normDate(row.store_to).toISOString()}'` : 'DEFAULT';
        const jsonb = JSON.stringify(row.jsonb) ;
            //TO ENCODE ????
        let sql = '';
        if(!!row.id) { 
sql = 
`INSERT INTO ${Enviro.DB_SCHEMA}.${table}(
    id, kind, key, store_to, jsonb)
    VALUES ('${row.id}','${row.kind}','${row.key}',${store_to},'${jsonb}')
RETURNING *;`
        } else { 
sql = 
`INSERT INTO ${Enviro.DB_SCHEMA}.${table}(
     kind, key, store_to, jsonb)
    VALUES ('${row.kind}','${row.key}',${store_to},'${jsonb}')
RETURNING *;`
        }
        return sql;
    }


    UpdateRow(table: string, row: StoreDto): string {
        const store_to = (row.store_to) ?
            `'${row.store_to.toISOString()}'` : "DEFAULT";
        const jsonb = row.jsonb;
        //TO ENCODE ????
        const sql =
            
`UPDATE ${Enviro.DB_SCHEMA}.${table} SET ` +
    `stored=now(), ` +
    `store_to=${store_to}, ` +
    `jsonb=${jsonb} ` +
`WHERE kind='${row.kind}' AND key='${row.key}' ` +
`RETURNING * ;`
    return sql;
    }

}

export const SqlFactory: SqlFactoryClass = new SqlFactoryClass();
