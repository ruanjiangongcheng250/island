const baseAuth = require('basic-auth')
const jwt = require('jsonwebtoken');

const {
    Forbbiden
} = require('../core/http-exception');
const {
    secretKey
} = require('../config/config').security;

class Auth {
    constructor(level) {
        this.level = level || 1;
        Auth.USER = 8;
        Auth.ADMIN = 16;
        Auth.SUPER_ADMIN = 32;
    }

    get m() {
        return async (ctx, next) => {
            const userToken = baseAuth(ctx.req);
            let errorMsg = 'token不合法';
            let decode;
            if (!userToken || !userToken.name) {
                throw new Forbbiden(errorMsg);
            }
            try {
                decode = jwt.verify(userToken.name, secretKey)
            } catch (error) {
                if (error.name == "TokenExpiredError") {
                    errorMsg = 'token已过期';
                }
                throw new Forbbiden(errorMsg);
            }

            if (decode.scope < this.level) {
                errorMsg = '权限不足';
                throw new Forbbiden(errorMsg)
            }

            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }

            await next();
        }
    }

    static verifyToken (token) {
        try {
            jwt.verify(token, global.config.security.secretKey)
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = {
    Auth
}