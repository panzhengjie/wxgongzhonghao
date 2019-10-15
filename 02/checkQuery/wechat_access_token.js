let {appID,appsecret} = require('../config/index') //引入变量
let rp = require('request-promise-native') //引入请求接口函数
const request = require('request');//引入请求接口函数，可请求可写流
let {writeFile,readFile} = require('fs') //引入读写模块
let menu = require('./menu')
let {readData,writeData} =require('../utils/tools');
let {createReadStream,createWriteStream} = require('fs');//创建可读流
let {resolve,join} = require('path');// 绝对定位
//access_token 是公众号全局唯一接口调用的标识，有效期两个小时，每天权限2000次
/*分析
* 读取本地文件(readAccessToken)
*     --有文件
*       --值没过期(isVolidAccessToken)
*         --直接使用
*       --值过期
*           --重新获取(getAccessToken)，保存(saveAccessToken)
*     --没文件
*         --获取，保存使用
*  */
class Wechat {
  //获取accessToken
  getAccessToken(){ //得到值
    return  new Promise((resolve,reject)=>{
      let url= `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
      rp({
        method:'GET',
        url,
        json:true
      }).then(res=>{
        res.expires_in = Date.now() + (7200-300)*1000
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
  };
  saveAccessToken(accessToken){ //保存值
    return writeData(accessToken,'./accessToken.txt')
  };
  readAccessToken(){ //读值
    return readData('./accessToken.txt')
  };
  isvolidAccessToken(accessToken){ //判断值是否过期
    if(!accessToken && !accessToken.access_token && !accessToken.expires_in){
      return false
    }
    return accessToken.expires_in > Date.now()
  };
  fetchAccessToken () {
    //优化设置值
    if (this.access_token && this.expires_in && this.isvolidAccessToken(this)) {
      //说明之前保存过access_token，并且它是有效的, 直接使用
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in
      })
    }
    //是fetchAccessToken函数的返回值
    return this.readAccessToken()
        .then(async res =>{ //有本地文件
          if(this.isvolidAccessToken(res)){//判断值是否过期
            //resolve(res) n latest
            return Promise.resolve(res);
          }else{//值过期
            let res =await this.getAccessToken(); //获取值
            await this.saveAccessToken(res); //之后是保存值
            return Promise.resolve(res);
            //resolve(res)
          }
        })
        .catch(async err =>{ //无本地文件
          let res =await this.getAccessToken(); //获取值
          await this.saveAccessToken(res) ;//之后是保存值
          return Promise.resolve(res);
          //resolve(res)
        })
        .then(res=>{
          //将access_token挂载到this上
          this.access_token = res.access_token;
          this.expires_in = res.expires_in;
          //返回res包装了一层promise对象（此对象为成功的状态）
          //是this.readAccessToken()最终的返回值
          return Promise.resolve(res);
        })
  };
  //获取api_ticket
  getApiTicket(){ //得到值
    return  new Promise(async (resolve,reject)=>{
      //let url= `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
      let data = await this.fetchAccessToken();
      let url= `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${data.access_token}&type=wx_card`

      rp({
        method:'GET',
        url,
        json:true
      }).then(res=>{
        resolve({ticket:res.ticket,expires_in:Date.now() + (7200-300)*1000})
      }).catch(err =>{
        reject(err)
      })
    })
  };
  saveApiTicket(ticket){ //保存值
    return writeData(ticket,'./ticket.txt')
  };
  readApiTicket(){ //读值
    return readData('./ticket.txt')
  };
  isvolidApiTicket(data){ //判断值是否过期
    if(!data && !data.ticket && !data.expires_in){
      return false
    }
    return data.expires_in > Date.now()
  };
  fetchApiTicket () {
    //优化设置值
    if (this.ticket && this.ticket_expires_in && this.isvolidApiTicket(this)) {
      //说明之前保存过ticket_expires_in，并且它是有效的, 直接使用
      return Promise.resolve({
        ticket: this.ticket,
        expires_in: this.ticket_expires_in
      })
    }
    //是fetchAccessToken函数的返回值
    return this.readApiTicket()
      .then(async res =>{ //有本地文件
        if(this.isvolidApiTicket(res)){//判断值是否过期
          //resolve(res) n latest
          return Promise.resolve(res);
        }else{//值过期
          let res =await this.getApiTicket(); //获取值
          await this.saveApiTicket(res); //之后是保存值
          return Promise.resolve(res);
          //resolve(res)
        }
      })
      .catch(async err =>{ //无本地文件
        let res =await this.getApiTicket(); //获取值
        await this.saveApiTicket(res) ;//之后是保存值
        return Promise.resolve(res);
        //resolve(res)
      })
      .then(res=>{
        //将access_token挂载到this上
        this.ticket = res.ticket;
        this.ticket_expires_in = res.expires_in;
        //返回res包装了一层promise对象（此对象为成功的状态）
        //是this.readAccessToken()最终的返回值
        return Promise.resolve(res);
      })
  };

  createView(menu){ //创建菜单接口
    return new Promise(async (resolve, reject) => {
      try {
        let data = await this.fetchAccessToken();
        let url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
        let result = await rp({method: 'POST', url, json: true, body:menu});
        resolve(result)
      }
      catch
      (e)
      {
        reject('菜单创建失败'+e)
      }
    })
  };
  removeView(){ //删除接口
    return new Promise(async (resolve, reject) => {
      try {
        let data = await this.fetchAccessToken();
        let url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`;
        let result = await rp({method: 'GET', url, json: true});
        resolve(result)
      }catch (e) {
        reject('菜单删除失败'+e)
      }
    })
  };

  uploadMedia(type,fileName){ //上传临时素材
    const filePath = resolve(__dirname,'../media',fileName);//绝对定位

    return new Promise(async (resolve, reject) => {
      try {
        const {access_token} =await this.fetchAccessToken(); //获取access_token
        let url = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${access_token}&type=${type}`;
        const formData = { //可读流
          media : createReadStream(filePath)
        }
        const data = await rp({method:'POST',url,json:true,formData});
        resolve(data);
      }catch (e) {
        reject('上传素材失败了'+e);
      }

    })

  };
  getMedia(type,mediaId,fileName){ //获取临时素材
    const filePath = resolve(__dirname,'../media',fileName);//绝对定位
    return new Promise(async (resolve, reject) => {
      const {access_token} = await this.fetchAccessToken();
      let url =`https://api.weixin.qq.com/cgi-bin/media/get?access_token=${access_token}&media_id=${mediaId}`;
      if(type == 'video'){
        url = url.replace('https://','http://');
        const data = await rp({method:'GET',url,json:true});
        resolve(data);
      }else {
        request(url).pipe(createWriteStream(filePath)).once('close',resolve);
      }
    })
  };
  uploadPermanentMeterial(type,meterial,body){ //上传永久素材
    return new Promise(async (resolve1, reject) => {
      try {
        const {access_token} = await this.fetchAccessToken();
        let baseUrl = 'https://api.weixin.qq.com/cgi-bin/';
        let options = {
          method : 'POST',
          json:true
        }
        if(type === 'news'){
          options.url =  `${baseUrl}material/add_news?access_token=${access_token}`;
          options.body = meterial;
        } else if(type === 'pic'){
          options.url =  `${baseUrl}media/uploadimg?access_token=${access_token}`;
          options.formData = {
            media:createReadStream(join(__dirname,'../media',meterial))
          }
        }else {
          options.url =  `${baseUrl}material/add_material?access_token=${access_token}&type=${type}`;
          options.formData = {
            media:createReadStream(join(__dirname,'../media',meterial))
          };
          options.body = body;
        }
        const data = await rp(options);
        resolve(data)
      }catch (e) {
        reject('上传永久素材失败'+e)
      }
    })
  };
  //获取永久素材
  getPermanentMeterial(type,mediaId,fileName){
    return new Promise(async (resolve1, reject) => {
      try {
        const {access_token} = await this.fetchAccessToken();
        const url = `https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=${access_token}`;
        const options = {
          method : 'POST',
          url,
          json:true,
          body:{media_id:mediaId}
        };
        if(type === 'news'||'video'){
          const data = await rp(options);
          resolve(data)
        } else {
          request(options).pipe(createWriteStream(join(__dirname,'../media',fileName))).once('close',resolve)
        }
      }catch (e) {
        reject('获取永久素材失败'+e)
      }
    })
  };
  //上传素材，临时与永久方法二合一
  uploadMeterial(type,meterial,body,isPermant=true){
    return new Promise(async (resolve1, reject) => {
      try {
        const {access_token} = await this.fetchAccessToken();
        let options = {
          method : 'POST',
          json:true,
          formData:{
            media : createReadStream(join(__dirname,'../media',meterial))
          }
        };
        if(isPermant){
          let baseUrl = 'https://api.weixin.qq.com/cgi-bin/';
          if(type === 'news'){
            options.url =  `${baseUrl}material/add_news?access_token=${access_token}`;
            options.formData = null;
            options.body = meterial;
          } else if(type === 'pic'){
            options.url =  `${baseUrl}media/uploadimg?access_token=${access_token}`;
          }else {
            options.url =  `${baseUrl}material/add_material?access_token=${access_token}&type=${type}`;
            options.body = body;
          }
        }else {
          options.url = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${access_token}&type=${type}`;
        }
        const data = await rp(options);
        resolve(data)
      }catch (e) {
        reject('上传永久素材失败'+e)
      }
    })
  }
}
;
(async ()=>{
  let we =new Wechat();
  let result = await we.removeView();
  console.log(result);
  let data = await we.createView(menu);
  console.log(data)
  /*let data = await we.fetchApiTicket();
  console.log(data)*/
})()
module.exports = Wechat
