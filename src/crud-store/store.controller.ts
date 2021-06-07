import { Request, Response } from 'express';
import * as S from '../common/http-status';
import { SqlFactory } from './sql-factory';
import { Enviro } from '../enviro/enviro';
import  {StoreDto} from './store-dto'
import { StoreRequestHandler } from './store-request-handler';
import { EGuard } from './e-guard';
import { stringify } from 'uuid';
//mport { TaskMachine} from './task-machine'

function ResOk(res: Response, _key: string, _rows : any[]){
	
	if(Array.isArray(_rows) && _rows.length > 0){
		if(Enviro.RESP_UPSERT_BODY)
			res.send({status: S.OK, key: _key, rows:_rows , msg: 'OK'}).status(S.OK).end();
		else 
			res.sendStatus(S.OK).end();
		
	}
	else{
		ResNoContent(res,_key);	
	}
}
function ResCreated(res: Response,  _key: string, _rows : any[]){
	if(Array.isArray(_rows) && _rows.length > 0){
		if(Enviro.RESP_UPSERT_BODY)
			res.send({status: S.CREATED,  key: _key, rows:_rows , msg: 'CREATED'}).status(S.CREATED).end();
		else 
			res.sendStatus(S.CREATED).end();
	}
	else{
		ResNoContent(res,_key);	
	}
}
function ResNoContent(res: Response, _key: string){
		if(Enviro.RESP_UPSERT_BODY)
			res.send({status: S.NO_CONTENT, key: _key, rows:[] , msg: 'NO_CONTENT'})
				.status(S.NO_CONTENT).end();
		else 
			res.sendStatus(S.NO_CONTENT).end();
}

function ResExConflict(res: Response, info:string){
	res.send('ROW_CONFLICT :' + info)
		.status(S.ROW_CONFLICT).end();
}
function ResApplicationError(res: Response,e:Error){
	res.send('APPLICATION_ERROR : ' + e.message + '\n' + e.stack)
		.status(S.APPLICATION_ERROR).end();
}
function ResParametersError(res: Response , e:Error){
	res.send('PARAMETERS_ERROR : ' + e.message)
		.status(S.PARAMETERS_ERROR).end();
}
export class StoreController {

	public async Get$(req: Request, res: Response) {
		let rowsRet: any[] = [];
		let _key : string = '';
		try {

			let p: StoreRequestHandler = 
				new  StoreRequestHandler(req, res,EGuard.Kind );

			if (p.Validate() != S.OK)   {
				ResParametersError(res,p.Error);
				return ;
			}

			if (!p.db) {
				rowsRet = p.Store.getMany(p.kind, p.key)||[];
				
			} else {
				p.sql = SqlFactory.Get(p.queue, p.kind, p.key);
				rowsRet = await p.RunGet$();
				//p.Dump();
			}
			if(!p.db && rowsRet.length > 0){
				let arr0 = [];
				 rowsRet.forEach(r=>{
					let o = new Object();
					o["key"] = r.key;
					if( r.base64){o["base64"] = r.base64;}
					else if(r.item) {o["item"] = r.item;}
					arr0.push(o);
				});
				rowsRet =[...arr0] ;
			}
		
			let status = (rowsRet.length > 0) ? S.OK : S.NO_CONTENT;
			res.send(rowsRet).status(status).end();
		} catch (e) {

			ResApplicationError(res,e);
		}
	}

	///============================================================
	///	Inserts one row or if uuser has admin rights many row 
	/// POST
	/// Returns inserted row with  id and status inbound in body !!!;
	///==============================================================

	public async Insert$(req: Request, res: Response) {
		let key = '';
		let kind = '';
		try {
			let p: StoreRequestHandler = new StoreRequestHandler(req, res,
				  EGuard.Kind | EGuard.Key | EGuard.Body);
			if (p.Validate() != S.OK)   {
				ResParametersError(res,p.Error);
				return ;
			}
				
			p.sql = SqlFactory.InsertRow(p.queue,p.kind,p.bodyRow);
			const	row = await p.RunUpdate$();
	
			if(!!row){
				res.send({kind:p.kind,
						key:row.key,status:row.status,guid:row.guid})
					.status(S.CREATED).end();
					return;
			}

		} catch (e) {
			if(e.code != '23505'){
				ResApplicationError(res,e);	
			}
			console.error(e);
		}
		res.status(S.ROW_CONFLICT).send(`ROW_CONFLICT:Item[${kind}/${key}] just exists`)
			.end();

	}

	///============================================================
	///	Upserts one row or if uuser has admin rights many row 
	/// PUT now
	/// TO DO batch update !!!
	/// Returns upserted row with id and status inbound in body !!!;
	//==============================================================
	public async Upsert$(req: Request, res: Response) {
		try {
			let p: StoreRequestHandler = new StoreRequestHandler(req, res,
				 EGuard.Kind | EGuard.Key | EGuard.Body);
	
			if (p.Validate() != S.OK)   {
				ResParametersError(res,p.Error);
				return ;
			}
			let old = p.Store.getItem(p.kind, p.key);
				
			p.sql =  (!old)
				? SqlFactory.UpsertRow(p.queue, p.kind,p.bodyRow)
				: SqlFactory.UpdateRow(p.queue,p.kind, p.bodyRow);
			const row = await p.RunUpdate$();
			if(!!row){
				let httpStatus = (row.status == 0) ? S.CREATED : S.OK;
					//p.Dump();
					//res.sendStatus(httpStatus).end();
				res.send({kind:p.kind,key:row.key,
						status:row.status,guid:row.guid})
					.status(httpStatus).end();

			} else {
				res.sendStatus(S.NO_CONTENT).end();
			}	
		} catch (e) {
			console.error(e);
			ResApplicationError(res,e);
		}
	}

	///============================================================
	///	Deletes one row or if uuser has admin rights many row 
	/// by low of Get
	/// Returns old deleted rows;
	///==============================================================

	public async Delete$(req: Request, res: Response) {
	
		try {

			let p: StoreRequestHandler = new StoreRequestHandler(req, res,
				 EGuard.Kind | EGuard.Key);
	//		let _key = p.key || 'ALL';

			if (p.Validate() != S.OK)   {
				ResParametersError(res,p.Error);
				return ;
			}
			//FOR TASK MACHINE rowsOld = p.Store.getMany(p.kind, p.key);
			// if (!p.isAdmin && !p.oneRow) {
			// 	res.send('Tis user has no acess rights for group DELETE operation')
			// 		.sendStatus(S.FORBIDDEN).end();
			// 	return;
			// }
			p.sql = SqlFactory.Delete(p.queue, p.kind, p.key);
			//TaskMachine.EnqueueTask(p);
			const row0 = await p.RunDelete$();

			if(!!row0){
				 res.send({kind:p.kind,key:p.key,status:-1,guid: row0.guid})
				 	.status(S.OK).end();
			} else {
				res.send((`NO_CONTENT:Item[${p.kind}/${p.key}] doesn't exists`)).status(S.NO_CONTENT).end();
			}	
		} catch (e) {
			console.error(e);
			ResApplicationError(res,e);
		}
	}

}


