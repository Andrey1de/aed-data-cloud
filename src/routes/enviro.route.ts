/*
 * GET home page.
 */
import * as EX from 'express';
import express = require('express');
import { Enviro } from '../enviro/enviro';
import * as S from '../common/http-status';
 const router: EX.Router = EX.Router();
router.get('/get/:key?', GetKey);
router.get('/set/:key/:val?', SetKey);
function GetKey(req: EX.Request, res: EX.Response) {
    res.setHeader('content-kind', 'application/html');
    //res.setHeader('X-Content-Type-Options', 'nosniff');
 
    const key = req?.params?.key?.toString() || 'all';
    if (key != 'all') {
        let val = process.env[key]
        let str = `${key}=${val}`;
        console.log(str);
        res.send(str).status((val) ? S.OK : S.NOT_FOUND).end();

    } else {
        let obj: any = {};
        const env = process.env;
        let str = Enviro.dump();

          console.log(str);
        const retRes = str.replace(/\n/ig, '<br/>');

        res.send(retRes).status(S.OK).end();

    }
}
function SetKey(req: EX.Request, res: EX.Response) {
    res.setHeader('content-kind', 'application/html');
   const key = (req?.params?.key?.toString() || '').toLowerCase();
    let val = req?.params?.val?.toString() || '';
    let env = process.env;
    const num = +val || -1;

    if (key === 'dump' && num >= 0){
        env.LOG_RESPONSE = (num & 4) ? 'YES' : 'NO';   
        env.LOG_RESPONSE_DATA = (num & 2) ? 'YES' : 'NO';   
        env.LOG_SQL = (num & 1) ? 'YES' : 'NO';
        let str = Enviro.dump();
        console.log(str);
        const retRes = str.replace(/\n/ig, '<br/>');
        res.send(retRes).status(S.OK).end();

 
    } else if(!!val) {
        process.env[key] = val;
        if (val) {
            val = env[key];
        }
        let str = `${key}=${val}`;
        console.log(str);
        res.send(`${key}=${val}`).status((val) ? S.OK : S.IM_A_TEAPOT).end();
      } else {
        res.sendStatus(S.BAD_REQUEST).end();
    }
}


export const EnvRouter = router;