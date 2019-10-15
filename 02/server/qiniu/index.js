//将数据库中的图片上传到七牛云服务器中

//引入上传方法
const unload = require('./unload');
//引入nanoid获取唯一key值
const nanoid = require('nanoid')
module.exports = async (key,dataWay)=>{
  //1.获取数据库图片链接
  const movies = await dataWay.find({$or:[
      {[key]:''},
      {[key]:null},
      {[key]:{$exists:false}}
    ]});
  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]; //获取每个文档对象
    let url = movie.src;//获取每个图片链接
    let fileName = '.jpg';
    if(key === 'coverKey'){
      url = movie.cover;
    }else if (key === 'videoKey'){
      url = movie.link;
      fileName = '.mp4';
    }
    let key2 = `${nanoid(21)}${fileName}`;//对key值进行唯一值获取

    console.log(movie,url,key2);

    //2.将链接上传到七牛
    await unload(url,key2);
    //3.保存key值到数据库中
    movie[key] = key2 ;
    await movie.save();
  }


}
