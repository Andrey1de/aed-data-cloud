/*
 * GET home page.
 */

import * as EX from 'express';
import { Logger } from '../logger/logger';



class LoggerRouteInternal{
    readonly Router: EX.Router = EX.Router();
    static Single: LoggerRouteInternal = new LoggerRouteInternal();
    constructor() {
        this.createRouts(this.Router);
	}
    createRouts(router: EX.Router) {
        router.get('/', this.GetRoot);
     }
    GetRoot(req: EX.Request, res: EX.Response) {
        Logger.error("This is an error log");
        Logger.warn("This is a warn log");
        Logger.info("This is a info log");
        Logger.http("This is a http log");
        Logger.debug("This is a debug log");
    }
}



export const LoggerRouter = LoggerRouteInternal.Single.Router; ;