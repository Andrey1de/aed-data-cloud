import * as EX  from 'express';
import { AddressInfo } from "net";
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as pg from 'pg';
import { Enviro } from './enviro/enviro';

import { EnvRouter } from './routes/Env.route';
import { StoreRouter } from './routes/store.route';
import { LoggerRouter } from './routes/logger.route';

const debug = require('debug')('my express app');
const app: EX.Express = EX();

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


app.use('/env', EnvRouter);
app.use('/store', StoreRouter);
app.use('/LoggerRouter', StoreRouter);
/// ============ INIT VARIABLES
//app.set('port', process.env.PORT || 3000);
const env = process.env;
dotenv.config();
app.set('port', process.env.port || process.env.PORT || 8080);


const is_heroku: boolean = (env.IS_HEROKU == 'YES') ||
    (!env.IS_HEROKU && !env.POSTGRESS_LOCAL_CONNECTION_STRING);
app.set('IS_HEROKU', (is_heroku) ? 'YES' : 'NO');
app.set('DB_SCHEMA', env.DB_SCHEMA || 'public');
const DB_CONNECTION_STRING = env.DATABASE_URL ||
    env.POSTGRESS_LOCAL_CONNECTION_STRING;
app.set('DB_CONNECTION_STRING', DB_CONNECTION_STRING);
if (is_heroku) {
    env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

}
Enviro.config();
Enviro.dbConnect();

console.log('Enviro.Dump: \n'+Enviro.dump());


///==== END INIT


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
app.set('port', env.PORT);
console.log(`Express server ??? listening on port ${app.get('port')}`)
//const server = app.listen(app.get('port'), function () {
//    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
//});

function isTrue(str: string) {
    str = str?.toUpperCase() || '';
    return str === 'YES' || str === '1' || str === 'TRUE';
}

function dbConnect(): pg.Pool {

    if (Enviro.DB_CONNECTION_STRING && !this._Pool) {

        if (Enviro.IS_HEROKU) {
            pg.defaults.ssl = true;
        }

        this._Pool = new pg.Pool({
            connectionString: Enviro.DB_CONNECTION_STRING,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 20000,

        });
        this._Pool.on("connect", p => {
            console.log(`Postgres Pool connected ${app.get('DB_CONNECTION_STRING')}`)
        })
        this._Pool.on("error", p => {
            console.error(p);
        });
    }

    return this._Pool;
   // console.log(`Connection Pool is set to \n${app.get('DB_CONNECTION_STRING')}`);
}
