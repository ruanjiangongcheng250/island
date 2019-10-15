const {HttpException} = require('../core/http-exception');
const catchError = async (ctx, next)=> {
    try {
        await next();
    } catch (error) {
        const isProd = process.env.NODE_ENV === 'production'
        const isHttpException = error instanceof HttpException;
        if(!isProd && !isHttpException){
            throw error;
        }
        if(isHttpException){
            const body = {
                error_code: error.errorCode,
                request: `${ctx.method} ${ctx.path}`,
                msg: error.msg
            }
            ctx.body = body
            ctx.status = error.code
            console.error('HttpException:' + JSON.stringify(body));
        }else{
            const body = {
                error_code: 999,
                request: `${ctx.method} ${ctx.path}`,
                msg: error.message
            }
            ctx.body = body;
            ctx.status = 500;
            console.error('!HttpException:' + JSON.stringify(body));
        }
    }
}
module.exports = catchError