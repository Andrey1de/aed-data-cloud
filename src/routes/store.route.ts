
//import { Router } from 'express';
import { AsyncRouter  } from 'express-async-router';
import { StoreController } from '../crud-store/store.controller';
const router = AsyncRouter ();
//const router = Router();
const storeController = new StoreController();
//Get All Kind Or Kind/key - row
router.get('/:queue/:kind/:key?', storeController.Get$);
//Inserts(Insert) Row  Kind/key - row
router.post('/:queue/:kind/:key', storeController.Insert$);
//Upserts(Insert/Update) Row  Kind/key - row
router.put('/:queue/:kind/:key', storeController.Upsert$);
//Delete All Kind Or Kind/key - row
router.delete('/:queue/:kind/:key', storeController.Delete$);
export const StoreRouter = router;  







//import * as EX from 'express';
//import express = require('express');
////const StoreController = new StoreController();

// class StoreRouterInternal {
//    readonly Router: EX.Router = EX.Router();
//    readonly Controller: StoreController = new StoreController();
//    static Single: StoreRouterInternal = new StoreRouterInternal();
//    constructor() {
//        this.createRouts(this.Router);
//    }
//    createRouts(router: EX.Router) {
        
//        //Get All Kind Or Kind/key - row
   
//        router.get('/:queue/:kind/:key?', this.Controller.Get);
//        //Insert(Upsert) Row  Kind/key - row
//        router.post('/:queue/:kind/:key', this.Controller.Upsert);
//        //Update existing Row  Kind/key -this.Controller.Update);
//        router.post('/:queue/:kind/:key', this.Controller.Update);
//       //Delete All Kind Or Kind/key - row
//        router.delete('/:queue/:kind/:key', this.Controller.Delete);
//    }
  
//}


//////const router = Router();
//export const StoreRouter = StoreRouterInternal.Single.Router;
////export default StoreRouter;

//////function Filter(req: EX.Request, res: EX.Response, next) {
//////      //console.log('Time:', Date.now())
//////    next()
//////    throw new Error('Function not implemented.');
////////}
