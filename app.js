require('module-alias/register')
const Koa = require('koa');
const static = require('koa-static')
const path = require('path')
const parser = require('koa-bodyparser');
const https = require('https');
const fs = require('fs');
const enforceHttps = require('koa-sslify');
const InitManger = require('./core/init');
const catchError = require('./middleware/exception')


const app = new Koa();
// Force HTTPS on all page
app.use(enforceHttps());
app.use(catchError);
app.use(parser());
app.use(static(path.join(__dirname, './static')))
const options = {
    key: fs.readFileSync('./app/ssl/privatekey.pem'),
    cert: fs.readFileSync('./app/ssl/certificate.pem')
  };
InitManger.InitCore(app);
//app 应用程序对象
//中间件就是一个函数
app.listen(443);
https.createServer(options, app).listen(443, function () {
    console.log('Https server listening on port ' + 443);
});
console.log('*****************服务器启动**********');