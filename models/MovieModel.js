// models文件夹下的每个文件都对应Mongodb的bilibili数据库下的一个集合。

//导入 mongoose
const mongoose = require('mongoose');

// 创建文档结构
const MovieSchema = new mongoose.Schema({
  title: String,
  director: String
});

//创建模型对象
const MovieModel = mongoose.model('movie', MovieSchema);

//暴露
module.exports = MovieModel;