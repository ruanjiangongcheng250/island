const {Sequelize, Model} = require('sequelize');
const { unset, clone } = require('lodash')
const { dbName, user, password, host, port } = require('../config/config').database;
const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: false,
    timezone: '+08:00',
    define: {
        charset:'utf8mb4',
        timestamps: true,
        paranoid: true,
        underscored: true, //把驼峰命名转换为下划线链接的命名
        scopes: {
            'withoutTime': {
                attributes: {'exclude' : ['createdAt', 'updatedAt', 'deletedAt']}
            }
        }
    }
});
sequelize.sync({
    force: false
});

Model.prototype.toJSON = function(){
    let data = clone(this.dataValues);
    for(var i in data){
        if(i === "image"){
            if(!data[i].startsWith('http'))
                data[i] = global.config.host + data[i];
        }
    }
    unset(data, 'createdAt')
    unset(data, 'updatedAt')
    unset(data, 'deletedAt')
    return data;
}
module.exports = {
    sequelize
}