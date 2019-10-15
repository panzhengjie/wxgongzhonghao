//引入七牛服务
const qiniu = require('qiniu');
//定义好其中鉴权对象
const accessKey = 'LFB3WX2A4x55OZfFmzeDmZvSdQmrnuozViq23Ypt';
const secretKey = 'tmlSVZACa8laScOQ9APcnCTPQGhe17YCaOxxx3ck';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
//构建BucketManager对象：
//定义配置对象
const config = new qiniu.conf.Config();
//存储区域华北
config.zone = qiniu.zone.Zone_z2;
//BucketManager对象上的方法
var bucketManager = new qiniu.rs.BucketManager(mac, config);
// 存储空间的名称
const bucket = 'panzhengjie';//所创建的储存空间名

/*var resUrl = 'http://devtools.qiniu.com/qiniu.png';
var bucket = "if-bc";
var key = "qiniu.png";*/
//将上传方法暴露出去，需要传resUrl是要上传的图片链接,key这是服务器上储存的图片名
module.exports = (resUrl,key)=>{
  return new Promise((resolve, reject) => {
    bucketManager.fetch(resUrl, bucket, key, function(err, respBody, respInfo) {
      if (err) {
        console.log('上传失败');
        reject('上传失败');
      } else {
        if (respInfo.statusCode == 200) {
          console.log('上传成功');
          resolve();
        }
      }
    });

  })



}


