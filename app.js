// 核心逻辑

var createError = require('http-errors'); // 引入http-errors模块，用于创建HTTP错误对象
var express = require('express'); // 引入express模块，用于构建Web应用
var path = require('path'); // 引入path模块，用于处理文件路径
var cookieParser = require('cookie-parser'); // 引入cookie-parser模块，用于解析cookie
var logger = require('morgan'); // 引入morgan模块，用于日志记录

var indexRouter = require('./routes/web/index'); // 导入index路由模块
const authRouter = require('./routes/web/auth'); // 导入auth路由模块
const authApiRouter = require('./routes/api/auth'); // 导入auth接口路由文件
const accountRouter = require('./routes/api/account'); // 导入account接口路由文件
// 导入express-session 
const session = require("express-session"); // 用于处理会话管理的中间件
// 会话是一种在客户端和服务器之间存储数据的机制，用于跟踪用户的状态和身份验证信息。
const MongoStore = require('connect-mongo'); // 引入connect-mongo模块，用于将session存储到MongoDB中
// 导入配置项
const {DBHOST, DBPORT, DBNAME} = require('./config/config');

var app = express(); // 创建express应用程序
// 设置session的中间件
app.use(session({
  name: 'sid', // 设置cookie的name，默认值是：connect.sid
  secret: 'atguigu', // 参与加密的字符串（又称签名）  加盐
  saveUninitialized: false, // 是否为每次请求都设置一个cookie用来存储session的id // 游客...
  resave: true, // 是否在每次请求时重新保存session  20 分钟    4:00  4:20 // 频繁操作...
  store: MongoStore.create({
    mongoUrl: `mongodb://${DBHOST}:${DBPORT}/${DBNAME}` // 数据库的连接配置
  }),
  cookie: {
    httpOnly: true, // 开启后前端无法通过JS操作，以保护cookie的安全
    maxAge: 1000 * 60 * 60 * 24 * 7 // 这一条是控制sessionID的过期时间的！！！
  },
}))

// view engine setup
app.set('views', path.join(__dirname, 'views')); // 设置模板文件的存放路径
app.set('view engine', 'ejs'); // 设置视图引擎为ejs,专门处理views中的ejs文件

app.use(logger('dev')); // 使用morgan中间件记录日志
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: false })); // 解析URL编码的请求体，比如form发送的表单数据
app.use(cookieParser()); // 解析cookie
app.use(express.static(path.join(__dirname, 'public'))); // 设置静态文件目录，网站的根目录

app.use('/', indexRouter); // 使用index路由模块处理根路径请求
app.use('/', authRouter); // 使用auth路由模块处理根路径请求
app.use('/api', accountRouter); // 使用account接口路由模块处理/api路径下的请求
app.use('/api', authApiRouter); // 使用auth接口路由模块处理/api路径下的请求

// 上面4个路由模块都没有响应的话，就会执行下面代码（404

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // 响应404 
  res.render('404');//可以在404页面放公益内容
});

// error handler
app.use(function(err, req, res, next) {
  // 设置locals，仅在开发环境下提供错误信息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; // 导出app实例，暴露给www文件