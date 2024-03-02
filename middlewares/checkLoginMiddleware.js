//检测登录的中间件
module.exports = (req, res, next) => {
  //判断
  if(!req.session.username){
    return res.redirect('/login');
  }
  next();
}

// 在你的登录逻辑中，将用户的用户名存储在了 req.session.username 字段中，并将用户的 _id 存储在了 req.session._id 字段中。
// 你可能会疑惑为什么在检测登录状态的中间件中只检测 req.session.username 字段而不检测 _id 字段。

// 实际上，在这个特定的中间件中，检测 req.session.username 字段是否存在已经足够来判断用户是否已经登录。
// 这是因为在登录过程中，你使用了用户名作为唯一标识来验证用户的身份，并将用户名存储在会话中。

// 在登录成功后，你可以通过检查 req.session.username 的存在与否来确定用户是否已经登录。
/* 如果 req.session.username 存在，表示用户已经登录，因为只有在登录成功后才会将用户名存储在会话中!!!
 (没有登录成功就不会有信息存储在sessions集合中） */
 
// 相反，如果 req.session.username 不存在，表示用户未登录或登录已过期。