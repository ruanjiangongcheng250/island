const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');

const classicFields = {
    image: Sequelize.STRING,
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    title: Sequelize.STRING,
    type: Sequelize.STRING,
}

class Movie extends Model {

}

Movie.init(classicFields,{
    sequelize,
    tableName: 'movie'
})

class Sentence extends Model {

}

Sentence.init(classicFields,{
    sequelize,
    tableName: 'sentence'
})

const musicFields = Object.assign({
    url: Sequelize.STRING
}, classicFields)

class Music extends Model {

}

Music.init(musicFields, {
    sequelize,
    tableName: 'music'
})

module.exports = {
    Movie,
    Sentence,
    Music
}