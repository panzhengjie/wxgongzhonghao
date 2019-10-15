//引入express模块
let express = require('express')
//引入sha1加密模块
let sha1 = require('sha1')
//创建app应用实例
let app = express()
//验证服务器的有效性
/*{ signature: 'd9917b5895d48f68a0b1be082be4c642ce6f33ec',微信加密签名
  echostr: '5597949372287377855',随机字符串
  timestamp: '1569660959',发送请求时间戳
  nonce: '1041618784' }*///随机数字
const config = { //定义配置对象
  Token:'zhengjie0730',
  appID:'wx130742f4810db32b',
  appsecret:'f8df6d7cef06ce1964bf89b6641466e7'
}
app.use((req,res,next)=>{
  //微信服务器提供的参数
  //console.log(req.query)
  const {signature,echostr,timestamp,nonce} = req.query
  const {Token} = config
  let arr = [timestamp,nonce,Token]
  console.log(arr)
  let Arr = arr.sort()
  console.log(Arr)
  let str = Arr.join('')
  console.log(str)
  let sha1Str = sha1(str)
  console.log(sha1Str)
  if(sha1Str === signature){
    res.send(echostr)
  }else{
    res.end('error')
  }
})
//监听端口号
app.listen(3000,()=>{
  console.log('成功了')
})
