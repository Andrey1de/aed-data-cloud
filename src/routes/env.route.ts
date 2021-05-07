/*
 * GET home page.
 */
import * as EX from 'express';
import express = require('express');
import * as S from '../common/http-status';
 const router: EX.Router = EX.Router();
router.get('/get/:key?', GetKey);
router.get('/get/:key?', SetKey);
function GetKey(req: EX.Request, res: EX.Response) {
    res.setHeader('content-kind', 'text.plain');
    const key = req?.params?.key?.toString() || 'all';
    if (key != 'all') {
        let val = process.env[key]
        let str = `${key}=${val}`;
        console.log(str);
        res.send(str).status((val) ? S.OK : S.NOT_FOUND).end();

    } else {
        let obj: any = {};
        const env = process.env;
        let str = '';

        Object.keys(env).forEach(function (key) {
            str += `${key}=${env[key]}\n`;


        })
        console.log(str);

        res.send(str).status(S.OK).end();

    }
}
function SetKey(req: EX.Request, res: EX.Response) {
    const key = req?.params?.key?.toString() || '';
    let val = req?.params?.val?.toString() || '';
    if (key) {
        process.env[key] = val;
        if (val) {
            val = process.env[key];

        }
        let str = `${key}=${val}`;
        console.log(str);

        res.send(`${key}=${val}`).status((val) ? S.OK : S.IM_A_TEAPOT).end();


    } else {
        res.sendStatus(S.BAD_REQUEST).end();
    }


}


export const EnvRouter = router;