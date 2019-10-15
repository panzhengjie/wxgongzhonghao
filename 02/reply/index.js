let config = require('../config/index')
//引入sha1加密模块
let sha1 = require('sha1')
//引入getUserDataAsync，查看数据完成
let {getUserDataAsync,parseXMLAsync,formatMessage} = require('../utils/tools');
//接受发给用户的信息
let replay = require('./replay');
let reply = require('./reply_options')
module.exports = ()=>{
  return async (req,res,next)=>{
    //微信服务器提供的参数
    /*{ signature: 'd9917b5895d48f68a0b1be082be4c642ce6f33ec',微信加密签名
  echostr: '5597949372287377855',随机字符串
  timestamp: '1569660959',发送请求时间戳
  nonce: '1041618784' }*///随机数字
    //console.log(req.query)
    const {signature,echostr,timestamp,nonce} = req.query
    //console.log(req.query)
    const {Token} = config
    let arr = [timestamp,nonce,Token]
    let Arr = arr.sort()
    let str = Arr.join('')
    let sha1Str = sha1(str)
    if(req.method === 'GET'){ //进行服务器有效性验证
      if(sha1Str === signature){
        res.send(echostr)
        console.log('验证成功')
      }else{
        res.end('error')
      }
    }else if(req.method === 'POST'){
      if(sha1Str !== signature) {
        res.end("error")
      }
      let data =await getUserDataAsync(req)
      //console.log(data) 是XML数据
      let dataJS = await parseXMLAsync(data)
      //console.log(dataJS)
     //对用户信息进行处理
      let message = formatMessage(dataJS)
      console.log(message)


      //最终回复给用户的信息
      let options =await reply(message)
      console.log(options)
      let replyMessage = replay(options)
      console.log(replyMessage)
      res.send(replyMessage)
    }else{
      res.end("error")
    }
  }
}
