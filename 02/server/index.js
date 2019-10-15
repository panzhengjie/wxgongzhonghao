const db =require('../db') //引入创建数据库；
const qiniu =require('../server/qiniu/index');//将数据库的图片链接上传到服务器，再保存posterKey值
const saveTheaters = require('../server/save/saveTheaters');//保存热门数据的方法；
const saveTrailers = require('../server/save/saveTrailers');//保存预告片相关数据的方法；
const theatersCrawler = require('./crawler/theatersCrawler');
const trailersCrawler = require('./crawler/trailersCrawler');
//引入数据模型
const Theaters = require('../modle/Theaters');
const Trailers = require('../modle/Trailers');
(async ()=>{
  await db;
  //const result =await theatersCrawler();//爬取热门电影数据
  //await saveTheaters(result)//保存到数据库
  const result =await trailersCrawler();//爬取预告片数据
  await saveTrailers(result)//保存到数据库
  await qiniu('coverKey',Trailers); //上传图片链接到七牛
  await qiniu('posterKey',Trailers); //上传图片链接到七牛
  await qiniu('videoKey',Trailers); //上传图片链接到七牛

  //const result =await trailersCrawler();
})();
