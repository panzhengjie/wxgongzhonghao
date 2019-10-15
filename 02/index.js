//引入express模块
let express = require('express');
//引入路由器模块
const router = require('./router');
//引入数据库模块
const db = require('./db');
//创建app应用实例
let app = express();


//配置模板资源目录
app.set('views','./views');
//配置模板引擎
app.set('view engine','ejs');
//应用路由
(async () => {
  //等待连接数据库
  await db;
  //应用路由器
  app.use(router);
})();

//监听端口号
app.listen(3000,()=>{
  console.log('成功了');
})
