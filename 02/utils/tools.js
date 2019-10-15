const {parseString} = require('xml2js')
//引入xml2js 将xml转换成js对象
let {readFile,writeFile} = require('fs');//引入读写
let {resolve} =require('path');//绝对路径
module.exports = {
  getUserDataAsync(req){
    return new Promise((resolve,reject) =>{
      let str = '';
      req.on('data', data =>{
        str = data
        //console.log(str)
      })
        .on('end',()=>{
          resolve(str)
        })
    } )

  },
  parseXMLAsync(data){
    return new Promise((resolve,reject) =>{
      parseString(data,{stim:true},(err,data)=>{
        if(!err){
          resolve(data)
        }else {
          reject('转换失败')
        }
      })
    })
  },
  formatMessage(dataJS){
    let message= {};
    dataJS = dataJS.xml;
    if(typeof dataJS === 'object'){
      for (let key in dataJS) {
        let value = dataJS[key];
        if(Array.isArray(value)&&value.length>0){
          message[key] = value[0]
        }
      }
    }
    return message
  },
  readData(fileName){
    const pathFile = resolve(__dirname,fileName)
    return new Promise((resolve,reject)=>{
      readFile(pathFile,(err,data)=>{
        if(!err){
          data = JSON.parse(data)
          resolve(data)
        }else {
          reject(err)
        }
      })
    })
  },
  writeData(data,fileName){
    data=JSON.stringify(data)
    const pathFile = resolve(__dirname,fileName)
    return new Promise((resolve,reject)=>{
      writeFile(pathFile,data,err=>{
        if(!err){
          console.log('文件保存成功')
          resolve()
        }else {
          reject('保存失败')
        }
      })
    })
  }
}
