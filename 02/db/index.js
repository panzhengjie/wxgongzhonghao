//下载mongoose
//引入mongoose
const mongoose = require('mongoose')
module.exports = new Promise((resolve, reject) => {
  //连接数据库
  mongoose.connect('mongodb://localhost:27017/theaters',{useNewUrlParser:true})
//监听mongodb数据库连接状态
  mongoose.connection.once('open',err =>{
    if(!err){
      console.log('连接成功')
      resolve()
    }else {
      reject('连接失败')
    }
  })
})
