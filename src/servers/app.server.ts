//import cors = require('cors');

import  * as express from 'express';
import { Express } from 'express';
import { Env }from '../enviro/enviro';
import { StoreRouter }  from '../routes/store.route';
import { EnvRouter } from '../routes/env.route';
//import { RootRouter } from '../routes/root.route';
import { LoggerRouter } from '../routes/logger.route';




import * as pg from 'pg';



///
///  App server supplies the order of initialzation
///

export class AppServer{

    
   // readonly Env: DbServer;
    constructor(readonly app: Express | undefined) {
        this.envConfig();
        this.app = this.app || express();
        this.appConfig();
        this.dbConnect();
        this.routerConfig();
   
    }
   
    private envConfig() {
        //See enviro.ts !!!
        Env.config();

             
    }

    private appConfig() {
      
       // this.app.use(cors());
        this.app.use(express.json({ limit: '1mb' })); // 100kb default
        this.app.use(express.text());
        this.app.use(express.urlencoded({ extended: true }));
  
    }
    protected Pool: pg.Pool = undefined!;
    private dbConnect() {
        this.Pool = Env.dbConnect();
    }

    private routerConfig() {
        this.app.get("/logger", LoggerRouter );
        this.app.use('/env', EnvRouter);
        this.app.use('/store', StoreRouter);
       // this.app.use('/', RootRouter);

    }

   
}

//export const Server : ServerClass = new ServerClass(undefined);