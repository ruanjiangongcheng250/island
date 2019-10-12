const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');
const axios = require('axios')
const util = require('util')
const { Favor } = require('@models/favor')  

class Book extends Model {
    constructor(id){
        super()
        this.id = id
    }
    async detail(){
        const url = util.format(global.config.yushu.detailUrl, this.id)
        const detail = await axios.get(url)
        return detail.data;
    }

    static async searchFromYushu (q, start, count, summary = 1) {
        const url = util.format(global.config.yushu.keywordUrl, encodeURI(q), count, start, summary)
        const list =await axios.get(url)
        return list.data
    }

    static async getMyFavorBookCount (uid) {
        const count = await Favor.count({
            where: {
                uid,
                type: 400
            }
        })
        return count;
    }
}


Book.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    fav_nums: {
        type: Sequelize.INTEGER,
        defaultValue:  0
    }

}, {
    sequelize,
    tableName: 'book'
})

module.exports = {
    Book
}