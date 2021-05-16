import { Request, Response } from 'express';
import * as S from '../common/http-status';
import { SqlFactory } from './sql-factory';
import  {StoreDto} from './store-dto'
import { StoreRequestHandler } from './store-request-handler';
import { EGuard } from './e-guard';
import { TaskMachine} from './task-machine'



export class StoreController {

	
	public async Get$(req: Request, res: Response) {
		var rowsRet: StoreDto[] = [];
		try {

			let p: StoreRequestHandler = new StoreRequestHandler(req, res,
				'GET',EGuard.Kind | EGuard.Kind);

			if (p.Validate() != S.OK) {
				return;
			}
			if (!p.db) {
				rowsRet = p.Store.getMany(p.kind, p.key);
			} else {
				p.sql = SqlFactory.Get(p.queue, p.kind, p.key);

				await p.Run$();

				p.Dump();
				rowsRet = p.RowsResult;
			}
		
			if (rowsRet.length > 0) {
				res.send(rowsRet).end();
			} else {
				res.status(S.NOT_FOUND).end();

			}

		} catch (error) {
			res.status(S.CONFLICT).send(error);
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
				'DELETE',EGuard.Kind | EGuard.Kind);
			rowsOld = p.Store.getMany(p.kind, p.key);

			if (p.Validate() != S.OK) {
				return;
			}
			if (!p.isAdmin && !p.oneRow) {
				res.send('Tis user has no acess rights for group DELETE operation')
					.sendStatus(S.FORBIDDEN).end();
				return;
			}
			p.sql = SqlFactory.Delete(p.queue, p.kind, p.key);
			TaskMachine.EnqueueTask(p);

			if (rowsOld.length > 0) {
				res.status(S.OK).send(rowsOld).end();
			} else {
				res.sendStatus(S.NOT_FOUND).end();
  			}

			} catch (error) {
			res.status(S.CONFLICT).send(error);
		}
	}
	///============================================================
	///	Inserts one row or if uuser has admin rights many row 
	/// by low of Get
	/// Returns old deleted rows;
	//==============================================================

	public async Upsert$(req: Request, res: Response) {

		try {
			let p: StoreRequestHandler = new StoreRequestHandler(req, res,
				'INSERT', EGuard.Kind | EGuard.Kind | EGuard.Key | EGuard.Body);

			if (p.Validate() != S.OK) {
				return;
			}
			const old = p.Store.setItem(p.kind, p.key, p.row);
	
			p.sql = SqlFactory.UpsertRow(p.queue, p.row);
			let row = p.row;
			if (!old) {
				await p.Run$();
				row = p.RowsResult[0];
			} else {
				TaskMachine.EnqueueTask(p);
				row.status = 1;
			}
			let status = (row.status == 0) ? S.CREATED : S.OK;

			res.status(status).send([row]).end();

		} catch (error) {
			res.status(S.CONFLICT).send(error);

		}
	
	}


}
//	public async Update$(req: Request, res: Response) {

//		let p: StoreRequestHandler = new StoreRequestHandler(req, res,
//			'UPDATE', EGuard.Kind | EGuard.Kind | EGuard.Key | EGuard.Body);

//		try {
//			if (p.Validate() != S.OK) {
//				return;
//			}
//			const old = p.Store.setItem(p.kind, p.key, p.row);


//			const status = (old) ? S.CREATED : S.OK;
//			//This is more relaible to use Upsert !!!!
//			p.sql = SqlFactory.UpsertRow(p.queue, p.row);
//			TaskMachine.EnqueueTask(p);
//			res.send([p.row]).sendStatus(status).end();
//		} catch (error) {
//			res.status(S.CONFLICT).send(error);

//		}



//	}


//export const StoreServer: StoreServerClass = new StoreServerClass()