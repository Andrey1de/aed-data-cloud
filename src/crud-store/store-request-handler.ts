import { Response } from "express";
import { Request } from "express";
import { PoolClient } from "pg";
import { Enviro } from '../enviro/enviro';
import * as S from '../common/http-status';
import { EGuard } from "./e-guard";
import { GlobalGetMapSore, StoreCahche } from "./store-cache";
import { StoreDto } from "./store-dto";
import { stream } from "winston";



export class StoreRequestHandler {

	//readonly verb: string = undefined!;
	readonly queue: string = undefined!;
	readonly kind: string = undefined!;
	readonly key: string = undefined!;
	readonly db: boolean = false!;
	readonly isAdmin: boolean = false!;
	readonly oneRow: boolean = false!;
	//private readonly body: any = undefined!; //= (req.body.item || req.body);
	readonly bodyValid: boolean = false;//(this.body && this.body.jsonb)
	//this.row genera
	readonly row: StoreDto = undefined!; //= (req.body.item || req.body);
	readonly Store: StoreCahche;
	public sql: string = '';

	public RowsResult: StoreDto[] = [];
	
	private error: Error = undefined;
	get Error(): Error { return this.error; }
	private status: number = S.OK;
	get Status(): number { return this.status; }

	constructor(private req: Request, private res: Response,
		public readonly verb: string,
		public readonly flags: EGuard = EGuard.Zero)
	{
		this.queue = (req.params?.queue.toString() || 'memory').toLowerCase();
		this.kind = (req.params?.kind || '').toLowerCase();
		this.key = req.params?.key || '';
		if(this.queue == 'store' && this.kind  == 'money') {
			this.key = this.key.toUpperCase();

		}
	
		//let body = req.body?.item || req.body;
		const strDb = (req.query?.db || '').toLocaleString();
		this.db = strDb === '1' || strDb.startsWith('y') || strDb.startsWith('t');
		const strAdmin = (req.query?.admin || '').toLocaleString();
		this.isAdmin = strDb === 'admin' || strDb === 'kuku-ja-chajnik';
		this.Store = GlobalGetMapSore(this.queue);
		this.oneRow = !!this.key;
		this.bodyValid = !!this.oneRow && (!!req.body );
		//The row is generated in every case   but update and insert would be forbudden !!!
		if(this.bodyValid) {
			this.row = new StoreDto(undefined);
			this.row.key = this.key;
			this.row.kind = this.kind;
			this.row.stored = this.normDate(req.body.stored ,new Date());
			const dt : Date =  this.normDate(req.body.store_to,new Date('2100-01-01' ));
			this.row.store_to = dt;
			this.row.jsonb = req.body ;// 1.2.8 req.body === jsonb !!!
		}
		
	}

	normDate(that : any, deflt : Date) : Date{
		if(!that) return deflt;
		if(that instanceof Date) return that;
		//if(typeof that === "string") return Date.parse(that);
		return new Date(that);

	}

	get OK(): boolean { return this.status == S.OK };

	Validate(): number {
		this.error = undefined;
		let strError : string = '';
		this.res.setHeader('content-kind', 'application/json');
		if (!this.Store) {
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: queue:` + this.queue;
			this.status = S.BAD_REQUEST;
		}

		if ((this.flags & EGuard.Kind) && !this.kind) {//(this.flags & EGuard.Type) && this.kind
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: kind:` + this.kind;
			this.status = S.BAD_REQUEST;

		}

		if ((this.flags & EGuard.Key) && !this.key) {
			this.status = S.BAD_REQUEST;
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: key:` + this.key;
		}

		if ((this.flags & EGuard.Body) && !this.bodyValid) {
			this.status = S.PRECONDITION_FAILED;
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: body `;
		}

		if (this.status != S.OK) {
			this.error = new Error(strError);

			console.error(this.Error);
			this.res.send(strError).status(this.status).end();
		}
		return this.status;

	}
	
	public async Run$(toDump: boolean = true) {
		const isDelete = this.verb.toUpperCase() === 'DELETE';
		let client: PoolClient = undefined!;
		
		try {
			client = await Enviro.Pool.connect();
			const { rows } = await client.query(this.sql);
			 // Synchronize 
			this.RowsResult = rows?.map(r => {
					
				const row = new StoreDto(r);
				if (!isDelete) {
					this.Store.setItem(row.kind, row.key, row);
				} else {
					this.Store.removeItem(row.kind, row.key);

				}
				return row;
		
			}) || [];
		//	this.Dump();
		//	logSqlRes(this.verb, this, this.RowsResult);

		} catch (e) {
			this.error = e;
			//console.error(e);
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
				const jsonArr = this.RowsResult.map(p=>p.jsonb);
				console.table(jsonArr);
			}

		}
	
		
	}


}

