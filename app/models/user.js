const bcrypt = require('bcryptjs');
const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');

class User extends Model {
    static async verifyEmailPassword(email, plainPassword){
        const user = await User.findOne({
            where: {
                email
            }
        });
        if(!user){
            throw new global.errs.AuthFailed('账号不存在');
        }
        const correct = bcrypt.compareSync(plainPassword, user.password);
        if(!correct){
            throw new global.errs.AuthFailed('密码不正确');
        }
        return user;

    }

    static async getUserByOpenid(openid) {
        const user = await User.findOne({
            where: {
                openid
            }
        });
        return user;
    }

    static async registerByOpenid(openid) {
        return await User.create({
            openid
        })
    }
}

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        set(val) {
            const salt = bcrypt.genSaltSync(10); //生成盐  传入的数字越大  生成的成本时间就越大
            const psw = bcrypt.hashSync(val, salt); //不同密码生成的是不一样的  防止彩虹攻击
            this.setDataValue('password', psw);
        }
    },
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
},{sequelize, tableName: 'user'});

module.exports = {
    User
}
