const {Sequelize} = require('sequelize');
const { dbName, user, password, host, port } = require('../config/config').database;
const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: true,
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
module.exports = {
    sequelize
}