require('module-alias/register')
const Koa = require('koa');
const parser = require('koa-bodyparser');
const InitManger = require('./core/init');
const catchError = require('./middleware/exception')

const app = new Koa();
app.use(catchError);
app.use(parser());
InitManger.InitCore(app);
//app 应用程序对象
//中间件就是一个函数
app.listen(3000);