var express = require('express');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var db = require('./models');
var _ = require('lodash');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var moment = require('moment');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var router = require('./routes');
var config = require('./config.json')[process.env.NODE_ENV || 'development'];
var app = express();
app.enabled('trust proxy');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view cache', config['view_cache']);

app.use(logger('dev'));
app.use(bodyParser.json({limit:'500mb'}));  /*设置文本输入的值的大小*/
app.use(bodyParser.urlencoded({limit:'500mb',extended:true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));


var dbOption = config.session_option;
var sessionStoreOption = {
    host: dbOption.host,
    port: dbOption.port,
    user: dbOption.user,
    password: dbOption.password ,
    database: dbOption.database,
    checkExpirationInterval: 60 * 1000,
    expiration: 7 * 24 * 60 * 60 * 1000,
    createDatabaseTable: true
};

/**
 * session说明，本来一个系统一个浏览器只能允许一个用户登录，
 * 目前是同一个浏览器允许普通用户和管理员用户同时登陆，使用同一个sessinid，
 * 普通用户用member区分，管理员使用user区分，退出时互不影响。
 * @type {*|exports|module.exports}
 */
var sessionStore = new SessionStore(sessionStoreOption);
app.use(session({
    name: config.appCookieName || 'material',//cookie名称，默认为connect.id
    secret: config.session_secret,
    store: sessionStore,
    resave: false,//有touch方法
    saveUninitialized: false//不保存为初始化的sessiozn
}));

app.locals.moment = moment;
app.locals.moment.locale = 'zh-cn';
app.locals.global = global.global;
app.locals.global_url = "";
app.locals._super =config.super;
app.locals._ = _;
app.locals.setting = global.setting;

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

router(app);
process.on('uncaughtException', function (err) {
    console.error('An uncaught error occurred!');
    console.error(err.stack);
});
if ("development1" === app.get('env') || "production" === app.get('env')) {

    app.use(function (req, res, next) {
        res.status(404).redirect('/hint/404.html');
    });
    app.use(function (err, req, res, next) {
        if(err.message.indexOf("Failed to lookup view")>=0){
            res.status(404).redirect('/hint/404.html');
        }else{
            res.status(500).redirect('/hint/500.html');
        }
    });
    app.use(function (err, req, res, next) {
        res.status(504).redirect('/hint/500.html');
    });
}

/*module.exports = app;*/

app.set('port', config.port);
var server = http.createServer(app);
server.listen(app.get('port'));
console.log('visit http://localhost:'+config.port);

