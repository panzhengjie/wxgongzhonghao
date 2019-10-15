微信公众号，本文开发订阅号描述，由于服务号需求更高，权限也需要公司支撑。

一、搭建本地服务器
  1、npm init //引入模块
    npm i express //引入express模块
  2、使用ngrok 将 本地端口3000 映射成可访问网站 ngrok http 3000;
     在微信公众号测试接口中填入URL跟 Token；
  //引入express模块
  let express = require('express');
  //创建app应用实例
  let app = express();
  //验证服务器的有效性
  app.use((req,res,next)=>{
  //微信服务器提供的参数
      const {signature,echostr,timestamp,nonce} = req.query //接口配置会发送上面四个参数
      let arr = [timestamp,nonce,Token] //通过组合sha1加密形成sha1Str 与 signature 进行比较
      根据req.method 为get 就发送res.send(echostr);验证成功。
        req.method 为post ，则是用户通过微信传过来data。
        req.on('data',data =>{ result = data //接受过来的数据是XML数据
      }).on('end',()=>{}) 
      const {parseString} = require('xml2js')
      //引入xml2js 将xml转换成js对象 parseString(data,{stim:true},(err,data)=>{})
      再通过一个变量遍历储存data.xml。
      根据变量的MsgType 的不同，也就是用户发送消息的类型，设置options，再根据options，回复给用户消息。
  })；
  //监听服务器
  app.listen(3000,()=>{
    console.log('成功了');
  })
二、access_token 公众号的全局唯一接口调用凭据，有效期2个小时，每天限权2000次。
分析
* 读取本地文件(readAccessToken)
*     --有文件
*       --值没过期(isVolidAccessToken)
*         --直接使用
*       --值过期
*           --重新获取(getAccessToken)，保存(saveAccessToken)
*     --没文件
*         --获取，保存使用
三、配置路由
* npm i ejs 
* 主件中配置模板资源
  app.set('view','./views')
* 配置模板引擎
  app.set('view engine', 'ejs')
* router组件中
  //引入express模块
  const express = require('express');
  //获取Router
  const Router = express.Router;
  //创建路由器对象
  const router = new Router();
  router.get('/search',(req.res)=>{
    使用JS-SDK所需的参数；需要获取临时接口票据api_ticket
    在search.ejs 对应。
    res.render('search') //最后渲染页面
  });
  最后将路由对象暴露出去，主件中引入并app.use(router);
四、爬取数据
* npm i puppeteer --save-dev  下载爬虫工具生产环境 const puppeteer = require('puppeteer')
*  连接数据库
    await db;
*  爬取热门电影数据，爬取预告片数据
   1.打开浏览器  const browser = await puppeteer.launch({args:['']});
   2.新建标签页 const page = await browser.newPage();
   3.跳转到指定网址 await page.goto(url,{waitUntil:'networkidle2'});
   4.爬取数据 page.evaluate(()=>{})
   5.关闭浏览器 await browser.close()
*  保存到数据库
   1.创建约束、模型
   2.应用模型创建、并保存数据到数据库
*  上传图片链接到七牛 npm i qiniu -D 
   1.引入七牛服务
   2.定义上传方法
   3.将数据库中图片上传到七牛服务器中
五、预告片功能 DPlayer 库
   1.创建响应路由，将数据库信息渲染到页面上
   2.弹幕功能 
     获取请求参数
     保存到数据库中
     再从数据中取出相应数据
六、菜单栏
七、上传素材，获取素材
             
