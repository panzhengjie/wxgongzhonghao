//引入express模块
const express = require('express');
//验证服务器的有效性
let checkQuery = require('../reply/index');
//引入ticket
let weChat = require('../checkQuery/wechat_access_token');
//引入当前页面url
let {url} =require('../config/index');
//引入数据库模块
let Theaters = require('../modle/Theaters');
let Trailers = require('../modle/Trailers');
let Danmus =require('../modle/danmus')
//引入sha1加密模块
let sha1 = require('sha1');
//获取Router
const Router = express.Router;
//创建路由器对象
const router = new Router();
//创建class类实例对象
let we = new weChat();
router.get('/search',async (req,res)=>{
  //页面search路由
  /*noncestr=Wm3WZYTPz0wzccnW
  jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg
  timestamp=1414587457
  url=http://mp.weixin.qq.com?params=value*/
//参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。
// 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，
// 使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。
// 这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，
  let {ticket} = await we.fetchApiTicket();
  let noncestr = Math.random().toString().split('.')[1];
  let timestamp = Date.now();
  let arr = [
    `jsapi_ticket=${ticket}`,
    `noncestr=${noncestr}`,
    `timestamp=${timestamp}`,
    `url=${url}/search`
  ];
  let signature =sha1(arr.sort().join('&'));
  console.log(signature)
  res.render('search',{
    signature,
    noncestr,
    timestamp
  });//渲染页面，将渲染好的页面返回
})
router.get('/detail/:id',async (req,res)=>{
  const {id} = req.params;
  console.log(id);
  if(id){
    const data = await Theaters.findOne({doubanId: id},{_id:0});
    console.log(data);
    res.render('detail',{data});
  }else {
    res.end('error');
  }

})
router.get('/movie',async (req,res)=>{
    const data = await Trailers.find({},{_id:0});
    console.log('调取预告片数据库内容成功')
    res.render('movie',{data,url});
});
//获取弹幕信息
router.get('/v3', async (req,res)=>{
  let {id} = req.query;//获取用户请求的参数
  let data = await Danmus.find({doubanId:id});
  let resultData = [];
  //返回给用户的数据
  data.forEach(item=>{
    resultData.push([item.time, item.type, item.color, item.author, item.text]);
  });
  //返回响应
  res.send({code:0,data:resultData});
});
//接受弹幕信息
router.post('/v3', async (req,res)=>{
  //1.获取请求参数
  let result = await new Promise((resolve, reject) => {
    let body = '';
    req.on('data',data =>{
      body = data.toString();
    })
      .on('end',()=>{
        resolve(JSON.parse(body))
      })
  });
  const {id,author,time,text,color,type} = result;
  console.log(id)
  await Danmus.create({
    doubanId: id,
    author,
    time,
    text,
    color,
    type
  });
  console.log('保存到数据库')
  res.send({code:0,data:{}})
  /*{"id":3097572, 电影doubanId
  "author":"DIYgod", 发送者id
  "time":3.559083,  发送时间
  "text":"1111",    发送内容
  "color":16777215, 颜色
  "type":0}         类型
  */
})
//验证服务器的有效性
router.use(checkQuery());
//暴露给app.js
module.exports = router ;
