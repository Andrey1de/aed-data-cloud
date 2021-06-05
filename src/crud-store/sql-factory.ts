import { StoreDto } from './store-dto';
import { Enviro }from '../enviro/enviro';

 class UpdateRowHelper {
     kind: string;//row.kind || '';
     key: string;//row.key || '';
     item: string;//row.item || '';
     base64: string;//row.base64 || '';
     life_seconds: number;//+row.life_seconds;
     guid: string;//row.guid || '';
     status : number;

    constructor(public row:StoreDto){
        this.kind = `'${row.kind || ''}'` || '';
        this.key = `'${row.key}'` || '';
        this.item =  (row.item) ? `'${JSON.stringify(row.item)}'` : 'NULL';
        this.base64 = (row.base64) ? `'${row.base64}'` : 'NULL';//row.base64 || '';
        this.life_seconds = +row.life_seconds;//+row.life_seconds;
        let guidStr = ('' + row.kind + '/' + row.key).toLowerCase();
        this.guid = (row.guid) ? `'${row.guid}'` : `uuid_in(md5('${guidStr}')::cstring)`;
        this.status = +row.status;
   
    }
}

class SqlFactoryClass {
    constructor() {
    }

    normDate(that : any | undefined) : Date{
		if(that instanceof Date) that;
		return new Date(that);

	}
//========================= GET ========================================
    // SELECT kind, key, base64, item, status, stored, life_seconds, guid
	// FROM public.store;
    Get(table: string, kind: string, key: string = undefined!): string {
       let sql1 = (!key || key.toLowerCase() == 'all' || key.toLowerCase() == '*' ) ? 
       '' : `AND key='${key} '`;
        let sql = 
`SELECT kind, key, base64, item, status, stored, life_seconds, guid
FROM ${Enviro.DB_SCHEMA}.${table} 
WHERE kind='${kind}' ${sql1} ;`;
        return sql;
    }

//========================= DELETE ========================================
    Delete(table: string, kind: string, key: string = undefined!): string {
      let sql1 = (!key || key.toLowerCase() == 'all' || key.toLowerCase() == '*' ) ? 
       '' : `AND key='${key}' `;
        let sql = 
`DELETE FROM ${Enviro.DB_SCHEMA}.${table} 
 WHERE kind='${kind}' ${sql1} 
 RETURNING kind,key,status,guid;`;
        return sql;
    }

//========================= UPSERT ========================================
    UpsertRow(table: string, dto: StoreDto): string {
    const row = new UpdateRowHelper(dto);
      //  kind, key, base64, item, status, stored, life_seconds, guid
  
      const sql = 
`INSERT INTO ${Enviro.DB_SCHEMA}.${table}(
	kind, key, base64, item, status, life_seconds, guid)
	VALUES (${row.kind},${row.key},${row.base64},${row.item}, ${row.status} ,${row.life_seconds},${row.guid})
ON CONFLICT(kind, key) DO UPDATE SET
	stored = now(),
	base64 = EXCLUDED.base64,
	item = EXCLUDED.item,
	life_seconds = EXCLUDED.life_seconds,
    status = 1 
RETURNING kind,key,status,guid;`
//console.log(sql);
        return sql;
    }

//========================= INSERT ========================================
    InsertRow(table: string, dto: StoreDto): string {
        const row = new UpdateRowHelper(dto);
 
        const sql =
      //  kind, key, base64, item, status, stored, life_seconds, guid
`INSERT INTO ${Enviro.DB_SCHEMA}.${table}(
	kind, key, base64, item, status, life_seconds, guid)
	VALUES (${row.kind},${row.key},${row.base64},${row.item}, 0 ,${row.life_seconds},${row.guid})
RETURNING kind,key,status,guid;`

        return sql;
    }

//========================= UPDATE ========================================
    UpdateRow(table: string, dto: StoreDto): string {
        const row = new UpdateRowHelper(dto);
      //  kind, key, base64, item, status, stored, life_seconds, guid
      const sql = 
`UPDATE ${Enviro.DB_SCHEMA}.${table} SET
	stored = now(),
	base64 = ${row.base64},
	item = ${row.item},
	life_seconds = ${row.life_seconds},
	status = status + 1 
WHERE kind='${row.kind}' AND key='${row.key}'
RETURNING kind,key,status,guid;`

    return sql;
    }

}

export const SqlFactory: SqlFactoryClass = new SqlFactoryClass();
