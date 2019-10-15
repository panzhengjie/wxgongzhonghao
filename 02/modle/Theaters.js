//引入mongoose
const mongoose= require('mongoose');
//创建约束
const Schema = mongoose.Schema;
//约束设置
const TheatersSchema = new Schema({
  title: String,
  score: Number,
  director: String,
  actors: String,
  src:String,
  href:String,
  genre: [ String],
  doubanId:Number,
  runtime:String,
  summery:String,
  posterKey:String,
  releaseDate:String,
  createTime:{
    type:Date,
    default:Date.now()
  }
});
let Theaters  = mongoose.model('Theaters',TheatersSchema)
module.exports = Theaters
