const {HttpException} = require('../core/http-exception');
const catchError = async (ctx, next)=> {
    try {
        await next();
    } catch (error) {
        const isProd = process.env.MODE === 'prod';
        const isHttpException = error instanceof HttpException;
        if(!isProd && !isHttpException){
            throw error;
        }
        if(isHttpException){
            ctx.body = {
                error_code: error.errorCode,
                request: `${ctx.method} ${ctx.path}`,
                msg: error.msg
            }
            ctx.status = error.code
        }else{
            ctx.body = {
                error_code: 999,
                request: `${ctx.method} ${ctx.path}`,
                msg: error.message
            }
            ctx.status = 500;
        }
    }
}
module.exports = catchError