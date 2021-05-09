import { Response } from "express";
import { Request } from "express";
import { PoolClient } from "pg";
import * as  Env from '../enviro/enviro';
import * as S from '../common/http-status';
import { EGuard } from "./e-guard";
import { GlobalGetMapSore, StoreCahche } from "./store-cache";
import { StoreDto } from "./store-dto";



export class StoreRequestHandler {

	//readonly verb: string = undefined!;
	readonly queue: string = undefined!;
	readonly kind: string = undefined!;
	readonly key: string = undefined!;
	readonly db: boolean = false!;
	readonly isAdmin: boolean = false!;
	readonly oneRow: boolean = false!;
	//private readonly body: any = undefined!; //= (req.body.item || req.body);
	readonly bodyValid: boolean = false;//(this.body && this.body.btext)
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
		this.queue = req.params?.queue.toString() || 'memory';
		this.kind = req.params?.kind || '';
		this.key = req.params?.key || '';
		//let body = req.body?.item || req.body;
		const strDb = (req.query?.db || '').toLocaleString();
		this.db = strDb === '1' || strDb.startsWith('y') || strDb.startsWith('t');
		const strAdmin = (req.query?.admin || '').toLocaleString();
		this.isAdmin = strDb === 'admin' || strDb === 'kuku-ja-chajnik';
		this.Store = GlobalGetMapSore(this.queue);
		this.oneRow = !!this.key;
		this.bodyValid = this.oneRow && (req.body && req.body.btext);
		//The row is generated in every case   but update and insert would be forbudden !!!
		this.row = new StoreDto(undefined);
		this.row.key = this.key;
		this.row.kind = this.kind;
		this.row.stored = req.body?.stored || new Date();
		this.row.store_to = req.body?.store_to || new Date('2100-01-01');
		this.row.btext = req.body?.btext || {"item":""};

	
	}

	get OK(): boolean { return this.status == S.OK };

	Validate(): number {
		this.error = undefined;
		let strError : string = ';'
		this.res.setHeader('content-kind', 'application/json');
		if (!this.req.params?.queue) {
			this.req.params.queue = 'memory';
		}

		if ((this.flags & EGuard.Kind) && !this.kind) {//(this.flags & EGuard.Type) && this.kind
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: kind`;
			this.status = S.BAD_REQUEST;

		}

		if ((this.flags & EGuard.Key) && !this.key) {
			this.status = S.BAD_REQUEST;
			strError += ((!!strError) ? ' AND ' : '') + `Bad parameter: key `;

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
			client = await Env.Pool.connect();
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
			client?.release();
			client = undefined;
		}
	}

	protected prefixDump() {
		const p = this;
		const keyStr = (p.key) ? '/' + p.key : '';
	
		let prefix = `[${this.verb}]::[${p.queue}/${p.kind}${keyStr}]`;
		console.log(prefix);
		if (Env.TO_LOG_SQL) {
			console.log(this.sql);

		}

	}
	
	public Dump() {
	
		if (this.Error) {
			this.prefixDump();
			console.error(this.Error);

		}
		else if (Env.TO_LOG_RESPONSE) {
			this.prefixDump();

			if (this.RowsResult.length > 0 && Env.TO_LOG_RESPONSE_DATA) {
				console.table(this.RowsResult);
			}

		}
	
		
	}


}

