module.exports = {
    database: {
        dbName: 'island',
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'zhangtao'
    },
    security: {
        secretKey: 'abcdef',
        expiresIn: 60 * 60 * 24 * 30
    },
    wx: {
        appId: 'wxbbfb5fec0b2a7b19',
        appSecret: '5feb4ad105261e9615905ee59a4cee36',
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    },
    yushu:{
        detailUrl:'http://t.yushu.im/v2/book/id/%s',
        keywordUrl:'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
    },
    host: process.env.NODE_ENV === 'production' ? 'https://juemingzi.club/' : 'http://localhost:3000/'
}