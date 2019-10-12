const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');

class Flow extends Model {

}

Flow.init({
    index: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.STRING
    //type 100 Movie
    //type 200 Music
    //type 300 Sentence
},{
    sequelize,
    tableName: 'flow'
})

module.exports = {
    Flow
}