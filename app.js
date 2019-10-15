require('module-alias/register')
const Koa = require('koa');
const static = require('koa-static')
const path = require('path')
const parser = require('koa-bodyparser');
const https = require('https');
const fs = require('fs');
const { default: enforceHttps }  = require('koa-sslify');
const InitManger = require('./core/init');
const catchError = require('./middleware/exception')
const isProd = process.env.NODE_ENV === 'production'


const app = new Koa();
app.use(catchError);
app.use(parser());
app.use(static(path.join(__dirname, './static')))
InitManger.InitCore(app);
if(isProd){
    console.log('*****程序启动******');
    // Force HTTPS on all page
    app.use(enforceHttps());
    const options = {
        key: fs.readFileSync('./app/ssl/privatekey.key'),
        cert: fs.readFileSync('./app/ssl/certificate.crt')
      };
    https.createServer(options, app.callback()).listen(443);
}else{
    console.log('*****程序启动******');
    //app 应用程序对象
    //中间件就是一个函数
    app.listen(3000);
}