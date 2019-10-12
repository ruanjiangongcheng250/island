const axios = require('axios')
const util = require('util')
const {
	User
} = require('../models/user')
const {
	generateToken
} = require('../../core/util')
const {
	Auth
} = require('../../middleware/auth')

class WXManager {
	constructor() {

	}
	static async codeToToken(code) {
		const url = util.format(global.config.wx.loginUrl,
			global.config.wx.appId, global.config.wx.appSecret,
			code
		)
		const result = await axios.get(url);
		if (result.status !== 200) {
			throw new global.errs.AuthFailed('openid获取失败');
		}
		const errcode = result.data.errcode;
		const errmsg = result.data.errmsg;
		const openid = result.data.openid;
		if (errcode && errcode !== 0) {
			throw new global.errs.AuthFailed('openid获取失败' + errmsg);
		}

		let user = await User.getUserByOpenid(openid);
		if (!user) {
			user = await User.registerByOpenid(openid);
		}
		return generateToken(user.id, Auth.USER)
	}
}

module.exports = {
	WXManager
}