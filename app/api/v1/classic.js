require('module-alias/register')
const Router = require('koa-router');

const {Auth} = require('../../../middleware/auth');
const { Flow }  = require('@models/flow');
const { Art } = require('@models/art');
const { Favor } = require('@models/favor');
const { ClassicValidator } = require('@validators')

const router = new Router({
    prefix: '/v1/classic'
});
router.get('/latest', new Auth().m, async (ctx, next)=>{
    const flow = await Flow.findOne({
        order: [
            ['index','DESC'] //按照index的倒序排序
        ]
    })
    const art = await Art.getData(flow.art_id, flow.type)
    const likeLatest = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
    //art.dataValues.index = flow.index;
    art.setDataValue('index', flow.index);
    art.setDataValue('like_status', likeLatest);
    ctx.body = art
})

router.get('/:index/next',new Auth().m,  async (ctx)=>{
    await Art.getPrevOrNextClassic(ctx, 'next')
})

router.get('/:index/previous',new Auth().m,  async (ctx)=>{
    await Art.getPrevOrNextClassic(ctx, 'prev')
})

router.get('/:type/:id', new Auth().m, async (ctx)=>{
    const v = await new ClassicValidator().validate(ctx);
    const id = v.get('path.id');
    const type = parseInt(v.get('path.type'));
    const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
    artDetail.art.setDataValue('like_status', artDetail.like_status)
    ctx.body = artDetail.art
})

router.get('/:type/:id/favor', new Auth().m, async (ctx)=>{
    const v = await new ClassicValidator().validate(ctx);
    const id = v.get('path.id');
    const type = parseInt(v.get('path.type'));
    const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
    ctx.body = {
        fav_nums: artDetail.art.fav_nums,
        like_status: artDetail.like_status
    }
})

router.get('/favor',new Auth().m, async ctx=>{
    const uid = ctx.auth.uid
    const arts =  await Favor.getMyClassicFavors(uid)
    ctx.body = arts
})

module.exports = router