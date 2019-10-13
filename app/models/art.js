const {
    Movie,
    Music,
    Sentence
} = require('./classic');
const { Op } = require('sequelize')
const { flatten } = require('lodash')
const { PostiveIntegerValidator } = require('@validators')
const { Flow } = require('../models/flow');
const { Favor } = require('./favor');
class Art {
    constructor(art_id, type){
        this.art_id = art_id;
        this.type = type;
    }

    async getDetail(uid){
        const art = await Art.getData(this.art_id, this.type)
        if(!art){
            throw new global.errs.NotFound();
        }
        const like = await Favor.userLikeIt(this.art_id, this.type, uid);
        return {
            art,
            like_status: like
        }
    }

    static async getData(art_id, type, useScope = true) {
        let art = null;
        const finder = {
            where: {
                id: art_id
            },
            // attributes: {
            //     exclude: ['createdAt', 'deletedAt', 'updatedAt']
            // }
        }
        const scope = useScope ? 'withoutTime' : null;
        switch (type) {
            case 100:
                art = await Movie.scope(scope).findOne(finder)
                break;
            case 200:
                art = await Music.scope(scope).findOne(finder)
                break;
            case 300:
                art = await Sentence.scope(scope).findOne(finder)
                break;
            case 400:
                const { Book } = require('./book');
                art = await Book.scope(scope).findOne(finder)
                if(!art){
                    art = await Book.create({
                        id: art_id
                    })
                }
                break;
            default:
                break;
        }
        return art;
    }

    static async getList(artInfoList){
        const artInfoObj = {
            100: [],
            200: [],
            300: []
        }
        for(let artInfo of artInfoList){
            artInfoObj[artInfo.type].push(artInfo.art_id)
        }
        const arts = [];
        for(let key in artInfoObj){
            const ids = artInfoObj[key];
            if(ids.length === 0){
                continue;
            }
            const type = parseInt(key)
            arts.push(await Art._getListByType(ids, type))
        }
        return flatten(arts);
    }

    static async _getListByType(ids, type) {
        let arts = null;
        const finder = {
            where: {
                id: {
                    [Op.in]: ids
                }
            },
        }
        const scope = 'withoutTime';
        switch (type) {
            case 100:
                arts = await Movie.scope(scope).findAll(finder)
                break;
            case 200:
                arts = await Music.scope(scope).findAll(finder)
                break;
            case 300:
                arts = await Sentence.scope(scope).findAll(finder)
                break;
            case 400:

                break;
            default:
                break;
        }
        return arts;
    }

    static async getPrevOrNextClassic(ctx, type) {
        const v = await new PostiveIntegerValidator().validate(ctx, {
            id: "index"
        })
        let index = v.get('path.index');
        if(type === 'prev'){
            index = index - 1;
        }else if(type === 'next'){
            index = index + 1;
        }
        const flow = await Flow.findOne({
            where: {
                index
            }
        })
        if(!flow) {
            throw new global.errs.NotFound();
        }
        const art = await Art.getData(flow.art_id, flow.type)
        const likePrevious = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
        //art.dataValues.index = flow.index;
        art.setDataValue('index', flow.index);
        art.setDataValue('like_status', likePrevious);
        ctx.body = art
    }
}


module.exports = {
    Art
}