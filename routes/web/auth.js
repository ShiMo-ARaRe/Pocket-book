// 注册，登录，退出登录，以及为通过验证的用户分配cookie

var express = require('express');
var router = express.Router();
//导入 用户的模型
const UserModel = require('../../models/UserModel');
const md5 = require('md5'); // 对数据进行加密
//注册
router.get('/reg', (req, res) => {
  //响应 HTML 内容
  res.render('auth/reg'); // 会在views文件夹下进行查找 (模板文件的存放路径+auth/reg
});

//注册用户
router.post('/reg', (req, res) => {
  //做表单验证
  //获取请求体的数据
  UserModel.create({...req.body, password: md5(req.body.password)}, (err, data) => {
    if(err){
      res.status(500).send('注册失败, 请稍后再试~~');
      return
    }
    res.render('success', {msg: '注册成功', url: '/login'});
  })
  
});


//登录页面
router.get('/login', (req, res) => {
  //响应 HTML 内容
  res.render('auth/login');
});

//登录操作
router.post('/login', (req, res) => {
  //获取用户名和密码
  let {username, password} = req.body;
  //查询数据库
  UserModel.findOne({username: username, password: md5(password)}, (err, data) => {
    //判断
    if(err){
      res.status(500).send('登录, 请稍后再试~~');
      return
    }
    //判断 data
    if(!data){
      return res.send('账号或密码错误~~');
    }

    // 会话对象是与每个客户端请求相关联的对象，用于在服务器和客户端之间存储和传递数据。
    // 将用户的用户名和唯一标识符存储在会话对象 req.session 中。这样，会话对象中就包含了用户的身份信息。
    // 写入session
    req.session.username = data.username;
    req.session._id = data._id;
    // 这两行代码是将 data.username 和 data._id 的值存储在会话对象 req.session 中的 username 和 _id 属性中。
    // 与此同时，会话对象的数据会被存储到 MongoDB 的 sessions 集合中的文档中。
    // 这是通过会话中间件（如 express-session 结合 connect-mongo）来实现的。

    // 为什么只传用户名和id？
    /* 原因：不建议将用户的密码存储在会话对象中或任何其他客户端可访问的地方，
    包括 req.session。这是因为密码是敏感信息，应该进行适当的保护和安全存储。
    如果只有用户名泄露，而没有相应的密码或其他身份验证信息泄露，那么仅仅知道用户名是不足以窃取账号信息的。
    */

    //登录成功响应
    res.render('success', {msg: '登录成功', url: '/account'});
  })

});

//退出登录
router.post('/logout', (req, res) => { //将get改成post可以防止CSRF跨站请求伪造
  //销毁 session
  req.session.destroy(() => {
    res.render('success', {msg: '退出成功', url: '/login'});
  })
});

// CSRF攻击的产生原因通常是由于Web应用程序的设计缺陷、相关网站的信任关系、自动请求以及缺乏足够的防御措施。
// 为了防止CSRF攻击，可以使用CSRF令牌、实施SameSite Cookie属性、检查Referer头信息、
// 避免在GET请求中执行敏感操作以及定期更新会话令牌等预防措施。

module.exports = router;
