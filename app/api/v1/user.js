const Router = require('koa-router');
const { RegisterValidator } = require('../../validators/validator');
const { Success } = require('../../../core/http-exception')
const { User } = require('../../models/user');
const router = new Router({
    prefix: '/v1/user'
});

router.post('/register', async (ctx)=>{
    const v = await new RegisterValidator().validate(ctx);
    //token 无意义的随机字符串
    //jwt 可以携带数据
    const user = {
        email: v.get('body.email'),
        password: v.get('body.password1'),
        nickname: v.get('body.nickname')
    }
    await User.create(user);
    throw new Success()
})

module.exports = router