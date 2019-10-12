const { Sequelize, Model, Op } = require('sequelize');
const { sequelize } = require('../../core/db');

class Favor extends Model {
    static async like(art_id, type, uid) {
        const { Art } = require('./art');
        //1. 添加记录 2. 修改classic 的fav_nums  两个操作要同时执行  数据库的事务
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        if(favor){
            throw new global.errs.LikeError();
        }
        return sequelize.transaction(async (t)=>{
            await Favor.create({
                art_id,
                type,
                uid
            },{
                transaction: t
            })
            const art = await Art.getData(art_id, type, false);
            await art.increment('fav_nums', {
                by: 1,
                transaction: t
            });

        })
    }

    static async unlike(art_id, type, uid){
        const { Art } = require('./art');
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        if(!favor){
            throw new global.errs.DislikeError();
        }
        return sequelize.transaction(async (t)=>{
            await favor.destroy({
                force: true,  // false 软删除
                transaction: t
            },)
            const art = await Art.getData(art_id, type, false);
            await art.decrement('fav_nums', {
                by: 1,
                transaction: t
            });

        })
    }


    static async userLikeIt (art_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        return favor ? true : false;
    }

    static async getMyClassicFavors (uid) {
        const { Art } = require('./art');
        const arts =await Favor.findAll({
            where: {
                uid,
                type: {
                    [Op.not]: 400
                }
            }
        })
        if(!arts){
            throw new global.errs.NotFound()
        }
        return await Art.getList(arts)
    }

    static async getBookFavor(uid, bookId){
        const fav_nums = await Favor.count({
            where: {
                art_id: bookId,
                type: 400
            }
        })

        const myFavor = await Favor.findOne({
            where: {
                art_id: bookId,
                uid,
                type: 400
            }
        })
        return {
            fav_nums,
            like_status: myFavor ? 1 : 0

        }

    }
}
Favor.init({
    uid: Sequelize.INTEGER,
    type: Sequelize.STRING,
    art_id: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'favor'
})

module.exports = {
    Favor
}
