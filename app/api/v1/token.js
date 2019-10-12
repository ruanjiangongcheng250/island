const Router = require('koa-router');
const {
    TokenValidator,
    NotEmptyValidator
} = require('../../validators/validator');
const {
    LoginType
} = require('../../lib/enum');
const {
    User
} = require('../../models/user');
const {
    generateToken
} = require('../../../core/util')
const {
    Auth
} = require('../../../middleware/auth');
const {
    WXManager
} = require('../../services/wx');

const router = new Router({
    prefix: '/v1/token'
});

router.post('/', async (ctx, next) => {
    const v = await new TokenValidator().validate(ctx);
    let token;
    switch (v.get('body.type')) {
        case LoginType.USER_EAMIL:
            token = await emailLogin(v.get('body.account'), v.get('body.secret'));
            ctx.body = {
                token
            };
            break;
        case LoginType.USER_MINI_PROGRAM:
            token = await WXManager.codeToToken(v.get('body.account'));
            ctx.body = {
                token
            };
            break;
        case LoginType.ADMIN_EMAIL:

            break;
        default:
            throw new global.errs.ParameterException('没有相应的处理函数');
    }
});

router.post('/verify', async (ctx)=>{
    const v =await new NotEmptyValidator().validate(ctx);
    const result = Auth.verifyToken(v.get('body.token'));
    ctx.body = {
        is_valid: result
    }
})

async function emailLogin(email, password) {
    const user = await User.verifyEmailPassword(email, password);
    return token = generateToken(user.id, Auth.USER)
}

module.exports = router;