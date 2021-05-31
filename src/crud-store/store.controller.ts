import { Request, Response } from 'express';
import * as S from '../common/http-status';
import { SqlFactory } from './sql-factory';
import { Enviro } from '../enviro/enviro';
import  {StoreDto} from './store-dto'
import { StoreRequestHandler } from './store-request-handler';
import { EGuard } from './e-guard';
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

function ResExConflict(res: Response, _key: string , info:string){
	res.send({status: S.ROW_CONFLICT,  key: _key, msg: 'ROW_CONFLICT :' + info})
		.status(S.ROW_CONFLICT).end();
}
function ResApplicationError(res: Response , e:Error){
	res.send({status: S.APPLICATION_ERROR,  msg: 'APPLICATION_ERROR : ' + e.message + '\n' + e.stack})
		.status(S.APPLICATION_ERROR).end();
}
function ResParametersError(res: Response , e:Error){
	res.send({status: S.PARAMETERS_ERROR,  msg: 'PARAMETERS_ERROR : ' + e.message })
		.status(S.PARAMETERS_ERROR).end();
}
export class StoreController {

	public async Get$(req: Request, res: Response) {
		var rowsRet: StoreDto[] = [];
		try {

			let p: StoreRequestHandler = new
			 StoreRequestHandler(req, res,
				'GET',EGuard.Kind );

			if (p.Validate() != S.OK)   {
				ResParametersError(res,p.Error);
				return ;
			}
			if (!p.db) {
				rowsRet = p.Store.getMany(p.kind, p.key)||[];
				
			} else {
				p.sql = SqlFactory.Get(p.queue, p.kind, p.key);
				await p.Run$();
				p.Dump();
				rowsRet = p.RowsResult;
			}
			let status = (rowsRet.length > 0) ? S.OK : S.NO_CONTENT;
			const jsonArr = rowsRet.map(
				p=> p.normJSonB()
			) || [];
			let key =  p.key || 'ALL';
			ResOk(res,key,jsonArr);
		} catch (e) {

			ResApplicationError(res,e);
		}
	}

		///============================================================
	///	Inserts one row or if uuser has admin rights many row 
	/// POST
	/// Returns inserted row with  id and status inbound in body !!!;
	//==============================================================

	public async Insert$(req: Request, res: Response) {


		try {
			let p: StoreRequestHandler = new StoreRequestHandler(req, res,
				'INSERT', EGuard.Kind | EGuard.Kind | EGuard.Key | EGuard.Body);

			if (p.Validate() != S.OK)   {
				ResParametersError(res,p.Error);
				return ;
			}
			const old = p.Store.getItem(p.kind, p.key);
	
			if (old) {
				ResExConflict(res,  p.key,`The key:${p.key} just exists`);
				return;			
			} 
	
			p.sql = SqlFactory.InsertRow(p.queue, p.row);
			//let row = p.row;
			p.RowsResult = await p.Run$();
	
			if(p.RowsResult?.length > 0){
				p.Store.setItem(p.kind, p.key,p.RowsResult[0]);
				p.Dump();
				let row = p.RowsResult[0].normJSonB();
				row.status = 1;
				ResCreated(res, p.key,[row]);
			}
			else{
				ResNoContent(res ,p.key);
				return;
			}

		} catch (e) {
			console.error(e);
			ResApplicationError(res,e);

		}
	
	}

	///============================================================
	///	Upserts one row or if uuser has admin rights many row 
	/// PUT
	/// Returns upserted row with id and status inbound in body !!!;
	//==============================================================
	public async Upsert$(req: Request, res: Response) {


		try {
			let p: StoreRequestHandler = new StoreRequestHandler(req, res,
				'INSERT', EGuard.Kind | EGuard.Kind | EGuard.Key | EGuard.Body);

			if (p.Validate() != S.OK)   {
				ResParametersError(res,p.Error);
				return ;
			}
			const old = p.Store.getItem(p.kind, p.key);
	
			p.sql = SqlFactory.UpsertRow(p.queue, p.row);
		
			
			
			if (!old) {
				p.RowsResult = await p.Run$();
			} else {
			//	TaskMachine.EnqueueTask(p);
				p.RowsResult = await p.Run$();
			}
	
			if(p.RowsResult.length > 0){
				let row = p.RowsResult[0];
				let rowOut = row.normJSonB();
				if(p.row.status == 1){
					ResCreated(res, p.key,[rowOut]);
				} else {
					ResOk(res, p.key,[rowOut]);
				
				}
				p.Dump();

			} else {
				ResNoContent(res, p.key);
			
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
	//==============================================================

	public async Delete$(req: Request, res: Response) {
		var rowsOld: StoreDto[] = [];
		
		try {

			let p: StoreRequestHandler = new StoreRequestHandler(req, res,
				'DELETE',EGuard.Kind | EGuard.Kind | EGuard.Key);
	
			if (p.Validate() != S.OK)   {
				ResParametersError(res,p.Error);
				return ;
			}
			rowsOld = p.Store.getMany(p.kind, p.key);
			// if (!p.isAdmin && !p.oneRow) {
			// 	res.send('Tis user has no acess rights for group DELETE operation')
			// 		.sendStatus(S.FORBIDDEN).end();
			// 	return;
			// }
			p.sql = SqlFactory.Delete(p.queue, p.kind, p.key);
			//TaskMachine.EnqueueTask(p);
			p.RowsResult = await p.Run$();

			//let status = (!!rowsOld && rowsOld.length > 0) ? S.OK : S.NO_CONTENT;
			if(p.RowsResult.length > 0){
				const jsonArr = rowsOld.map(p=>{
					let r = p.normJSonB();
					p.status = -1;
					return r;
				});
				ResOk(res, p.key,jsonArr);

			} else {
				ResNoContent(res, p.key);
			}
					


		} catch (e) {
			console.error(e);
			ResApplicationError(res,e);

		}
	
	}

}


