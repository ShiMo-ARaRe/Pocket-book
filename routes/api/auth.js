// 登录，退出登录，以及为通过验证的用户分配token

var express = require('express');
var router = express.Router();
//导入 jwt
const jwt = require('jsonwebtoken');
/* jsonwebtoken 是一个流行的 JavaScript 库，用于生成和验证 JSON Web Tokens (JWT)。
 JWT 是一种用于在不同系统之间安全传输信息的令牌。 */

//导入配置文件
const {secret} = require('../../config/config')
//导入 用户的模型
const UserModel = require('../../models/UserModel');
const md5 = require('md5'); // 对数据进行加密

//登录操作
router.post('/login', (req, res) => {
  //获取用户名和密码
  let {username, password} = req.body;
  //查询数据库
  UserModel.findOne({username: username, password: md5(password)}, (err, data) => {
    //判断
    if(err){
      res.json({
        code: '2001',
        msg: '数据库读取失败~~~',
        data: null
      })
      return
    }
    //判断 data
    if(!data){
      return res.json({
        code: '2002',
        msg: '用户名或密码错误~~~',
        data: null
      })
    }
    
    //创建当前用户的 token
     // Token通常存储在客户端的本地存储（例如浏览器的localStorage或会话存储）或cookie中。
    let token = jwt.sign({
      username: data.username,
      _id: data._id
    }, secret, {
      expiresIn: 60 * 60 * 24 * 7   // 单位/s
    });
    
    //响应 token
    res.json({
      code: '0000',
      msg: '登录成功',
      data: token
    })

  })

});

//退出登录
router.post('/logout', (req, res) => {
  //销毁 session
  req.session.destroy(() => {
    res.render('success', {msg: '退出成功', url: '/login'});
  })
});

module.exports = router;
