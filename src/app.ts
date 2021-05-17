import * as EX  from 'express';
import { AddressInfo } from "net";
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as pg from 'pg';
import { Enviro } from './enviro/enviro';

import { EnviroRouter } from './routes/enviro.route';
import { StoreRouter } from './routes/store.route';
import { LoggerRouter } from './routes/logger.route';

const debug = require('debug')('my express app');
const app: EX.Express = EX();
 /// ============ INIT VARIABLES
//app.set('port', process.env.PORT || 3000);
const env = process.env;



Enviro.config();
app.set('port', process.env.port || process.env.PORT || 3000);

Enviro.dbConnect();

console.log('Enviro.Dump: \n'+Enviro.dump());


///==== END INIT
app.use(EX.json({ limit: '1mb' })); // 100kb default
app.use(EX.text());
app.use(EX.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(EX.static(path.join(__dirname, 'public')));

app.get('/', (req: EX.Request, res: EX.Response) => {
    res.render('index', {
        title: 'AED Heroku Service @2021-05-09',
        app: 'aed-data-cloud@' + Enviro.VERSION
    });
});
app.get('/help', (req: EX.Request, res: EX.Response) => {
    res.render('help', { title: 'Manual' });
});


app.use('/env', EnviroRouter);
app.use('/cloud', StoreRouter);
app.use('/LoggerRouter', StoreRouter);



// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err[ 'status' ] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(err[ 'status' ] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//app.set('port', env.PORT);
//console.log(`Express server ??? listening on port ${app.get('port')}`)
const server = app.listen(env.PORT, function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});

// function isTrue(str: string) {
//     str = str?.toUpperCase() || '';
//     return str === 'YES' || str === '1' || str === 'TRUE';
// }

//function dbConnect(): pg.Pool {

//    if (Enviro.DB_CONNECTION_STRING && !this._Pool) {

//        if (Enviro.IS_HEROKU) {
//            pg.defaults.ssl = true;
//        }

//        this._Pool = new pg.Pool({
//            connectionString: Enviro.DB_CONNECTION_STRING,
//            max: 20,
//            idleTimeoutMillis: 30000,
//            connectionTimeoutMillis: 20000,

//        });
//        this._Pool.on("connect", p => {
//            console.log(`Postgres Pool connected ${app.get('DB_CONNECTION_STRING')}`)
//        })
//        this._Pool.on("error", p => {
//            console.error(p);
//        });
//    }

//    return this._Pool;
//   // console.log(`Connection Pool is set to \n${app.get('DB_CONNECTION_STRING')}`);
//}
