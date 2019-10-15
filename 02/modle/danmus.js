//引入mongoose
const mongoose= require('mongoose');
//创建约束
const Schema = mongoose.Schema;
//约束设置
const DanmusSchema = new Schema({
  author: String,
  doubanId: Number,
  text: String,
  time: Number,
  type:Number,
  color:String,
  createTime:{
    type:Date,
    default:Date.now()
  }
});
let Danmus  = mongoose.model('Danmus',DanmusSchema)
module.exports = Danmus
