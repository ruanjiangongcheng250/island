class HttpException extends Error{
    constructor(msg="服务器异常", errorCode=10000, statusCode=400){
        super();
        this.msg = msg;
        this.errorCode = errorCode;
        this.code = statusCode;
    }
}

class ParameterException extends HttpException {
    constructor(msg="参数错误", errorCode=10001){
        super();
        this.msg = msg;
        this.errorCode = errorCode;
        this.code = 400;
    }
}

class Success extends HttpException {
    constructor(msg="ok", errorCode=0){
        super();
        this.msg = msg;
        this.errorCode = errorCode;
        this.code = 201; //操作成功
    }
}

class NotFound extends HttpException{
    constructor(msg="资源未找到", errorCode=10000){
        super();
        this.msg = msg;
        this.code = 404;
        this.errorCode = errorCode;
    }
}

class AuthFailed extends HttpException {
    constructor(msg="授权失败", errorCode=10004){
        super();
        this.msg = msg;
        this.code = 401;
        this.errorCode = errorCode;
    }
}

class Forbbiden extends HttpException {
    constructor(msg="禁止访问", errorCode=10006){
        super();
        this.msg = msg;
        this.code = 403;
        this.errorCode = errorCode;
    }
}

class LikeError extends HttpException {
    constructor(){
        super();
        this.msg = '你已经点赞过';
        this.code = 400;
        this.errorCode = 60001;
    }
}

class DislikeError extends HttpException {
    constructor(){
        super();
        this.msg = '你已取消点赞';
        this.code = 400;
        this.errorCode = 60002;
    }
}

module.exports = {
    HttpException,
    ParameterException,
    Success,
    NotFound,
    AuthFailed,
    Forbbiden,
    LikeError,
    DislikeError
}