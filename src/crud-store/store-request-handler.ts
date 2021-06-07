import { Response } from "express";
import { Request } from "express";
import { PoolClient } from "pg";
import { Enviro } from '../enviro/enviro';
import * as S from '../common/http-status';
import { EGuard } from "./e-guard";
import { GlobalGetMapSore, StoreCahche } from "./store-cache";
import { StoreDto } from "./store-dto";
import { env } from "process";
import { stat } from "fs";
//import { stream } from "winston";



export class StoreRequestHandler {

	//readonly verb: string = undefined!;
	readonly queue: string = undefined!;
	readonly kind: string = undefined!;
	readonly key: string = undefined!;
	readonly db: boolean = false!;
	readonly isAdmin: boolean = false!;
    readonly IsUpdate: boolean = false!;
	readonly oneRow: boolean = false!;
	readonly bodyValid: boolean = false!;
	//private readonly body: any = undefined!; //= (req.body.item || req.body);
	//this.row genera
	public sql: string = '';
	public readonly Store: StoreCahche = undefined;;

	public RowsResult: StoreDto[] = [];
	readonly bodyRow: StoreDto = undefined!; // for Update and Insert
	
	private error: Error = undefined;
	get Error(): Error { return this.error; }
	private status: number = S.OK;
	get Status(): number { return this.status; }
	public readonly verb: string;

	constructor(private req: Request, private res: Response,
			public readonly flags: EGuard )
	{
		this.verb = req.method.toUpperCase()
		this.queue = (req.params?.queue.toString() || 'memory').toLowerCase();
        this.Store = GlobalGetMapSore(this.queue);
        this.kind = (req.params?.kind || '').toLowerCase();
		this.key = (req.params?.key || '').toLowerCase();
        this.IsUpdate = this.verb === 'POST' ||  this.verb === 'PUT'||  this.verb === 'PATCH';
        this.oneRow = !!this.key;
		const db: string = (req.query.db?.toString() || '').toUpperCase();
		this.db = !!(+db) || db.startsWith('Y') || db.startsWith('TRU');
	    this.bodyValid = !!req.body;

//Normalization of this.row for Update Or Insert
//The row only for Insert and Update operations
 	    if(!!this.IsUpdate && (!!req.body ) && this.oneRow) {
            req.body.key =  this.key;
           // req.body.kind =  this.kind;
 			this.bodyRow = new StoreDto(req.body);
  		}
				
	}

	normDate(that : any, deflt : Date | undefined = undefined) : Date{
		if(!that) return deflt;
		if(that instanceof Date && !isNaN(that.getDate())) return that;
		var dt =  new Date(that);
		if(dt instanceof Date && !isNaN(dt.getDate())) return dt;
		return deflt;

	}

	get OK(): boolean { return this.status == S.OK };

	Validate(): number {
		this.error = undefined;
		let strError : string = '';
		this.res.setHeader('content-kind', 'application/json');
		if (!this.Store) {
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: queue:` + this.queue;
			//this.status = S.BAD_REQUEST;
		}

		if ((this.flags & EGuard.Kind) && !this.kind) {//(this.flags & EGuard.Type) && this.kind
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: kind:` + this.kind;
			//this.status = S.BAD_REQUEST;
		}

		if ((this.flags & EGuard.Key) && !this.key) {
			this.status = S.BAD_REQUEST;
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: key:` + this.key;
		}

		if ((this.flags & EGuard.Body) && !this.bodyValid) {
			this.status = S.PRECONDITION_FAILED;
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: body `;
		}

		if (!!strError ) {
			this.error = new Error(strError);
			this.status = S.PARAMETERS_ERROR;
			console.error(this.Error);
		//	this.res.send(strError).status(this.status).end();
		}
		return this.status;

	}
	public async RunGet$(toDump: boolean = true) : Promise<StoreDto[]>{
		let client: PoolClient = undefined!;
	
	try {
		client = await Enviro.Pool.connect();
		const { rows } = await client.query(this.sql);
		 // Synchronize 
		this.RowsResult = rows?.map(r => {
			const row = new StoreDto(r);
			   this.Store.setItem(this.kind, row.key, row);
			return row;
	
		}) || [];
		return this.RowsResult;

	} catch (e) {
		this.error = e;
		throw e;
		//console.error(e);
	} finally {
		if (client) {
			await client.release();
		}
		
		client = undefined;
	}
}

	//Returns  StoreDto with new  {kind,key,status}
	public async RunUpdate$(toDump: boolean = true) : Promise<StoreDto>{
		let client: PoolClient = undefined!;
		try {
			client = await Enviro.Pool.connect();
			let row = this.bodyRow;
			this.RowsResult = [];
			const	{rows}   = await client.query(this.sql);
			if(rows && rows.length > 0){
				const{kind,key,status,guid}  = rows[0];
				row.guid = guid;
				row.status = status;
				if(env.LOG_RESPONSE_DATA){
					if(status <= 0){
						console.log('RunInsert$',this.verb,row);
					} else {
						console.log('RunUpdate$',this.verb,row);
					}
				}
				this.Store.setItem(this.kind, row.key,row);
				this.RowsResult.push(row);
				return row;
			}
			return null;
		} catch (e) {
			this.error = e;
            throw e;
		} finally {
			if (client) {
				await client.release();
			}
			client = undefined;
		}
	}	
	//Returns  StoreDto with new  {kind,key,status}
	public async RunDelete$(toDump: boolean = true) : Promise<StoreDto>{
		let client: PoolClient = undefined!;
		try {
			client = await Enviro.Pool.connect();
			this.RowsResult = [];
			const	{rows}   = await client.query(this.sql);
			if(rows && rows.length > 0){
				const{kind,key,status,guid}  = rows[0];
				let row = this.Store.removeItem(kind, key);
				if(!!row){
					this.RowsResult.push(row);
					row.status = -1;
					row.guid = guid;	
					if(env.LOG_RESPONSE_DATA){
						console.log('RunDelete$',this.verb,row);
					}
				}

				return row;
			}
			
			return null;
		} catch (e) {
			this.error = e;
            throw e;
		} finally {
			if (client) {
				await client.release();
			}
			client = undefined;
		}
	}	


	protected prefixDump() {
		const p = this;
		const keyStr = (p.key) ? '/' + p.key : '';
	
		let prefix = `[${this.verb}]::[${p.queue}/${p.kind}${keyStr}]`;
		console.log(prefix);
		if (Enviro.LOG_SQL) {
			console.log(this.sql);

		}

	}
	
	public Dump() {
	
		if (this.Error) {
			this.prefixDump();
			console.error(this.Error);

		}
		else if (Enviro.LOG_RESPONSE) {
			this.prefixDump();
			
			if (this.RowsResult.length > 0 && Enviro.LOG_RESPONSE_DATA) {
				const jsonArr = this.RowsResult.map(p=>p.item);
				console.table(jsonArr);
			}

		}
	
		
	}


}

