//引入数据库约束模型
const Theaters  = require('../modle/Theaters');
const rp = require('request-promise-native')
//引入Url
const {url} = require('../config')
module.exports = async (message)=>{
  let options = {
    ToUserName : message.FromUserName,
    FromUserName:message.ToUserName,
    CreateTime:Date.now(),
    MsgType: 'text'
  }
  //接收到用户的信息
  let content = '你说什么，听不明白';
  if(message.MsgType === 'text'){
    if(message.Content ==='首页'){
      options.MsgType = 'news';
      content= [{
        title: '电影预告片首页',
        description1: '点击这里有预告片详情哦',
        PicUrl: `https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2884001504,2495418093&fm=26&gp=0.jpg`,
        url: `${url}/movie`
      }]
    }else if(message.Content ==='3'){
      content = "嘻嘻嘻333";
    }else if (message.Content.match('爱')) {
      content= '爱你呦~~';
    }else if (message.Content === '热门') { //回复用户热门消息数据
      const data = await Theaters.find({}, {title: 1, summery: 1, src: 1, posterKey:1,doubanId: 1, _id: 0});
      //将回复内容初始化为空数组
      content = [];
      options.MsgType = 'news';
      //通过遍历将数据添加进去
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        content.push({
          title: item.title,
          description1: item.summery,
          PicUrl: `http://pyxrqg6l7.bkt.clouddn.com/${item.posterKey}`,
          url: `${url}/detail/${item.doubanId}`
        })
      }
    }else{
      const url = 'https://douban.uieee.com/v2/movie/top250&count=8';
      const {subjects} = await rp({method:'GET',url,json:true});//qs:{q:message.Content,count:8}
      if(subjects&&subjects.length){
        content = [];
        options.MsgType = 'news';
        //通过遍历将数据添加进去
        for (let i = 0; i < subjects.length; i++) {
          let item = subjects[i];
          content.push({
            title: item.title,
            description1: `电影评分:${item.rating.average}`,
            PicUrl: item.images.small,
            url: item.alt
          })
        }
      } else {
        content = '没有热门电影'
      }


    }
      /*const data = await Theaters.find({},{title:1,summery:1,src:1,_id:0});
      options.MsgType = 'news';
      console.log(data)
      content = [];
      for (let i = 0; i < data.length; i++) {
        let resultElement = data[i];
        content.push({
          title:resultElement.title,
          description1:resultElement.summery,
          PicUrl:resultElement.src,
          url:'http://www.baidu.com'
        })

      }*/

  }else if(message.MsgType === 'image'){
      options.MsgType = 'image';
      options.PicUrl = message.PicUrl;
      options.MediaId = message.MediaId
  }else if(message.MsgType === 'voice'){
    //options.MediaId = message.MediaId
    options.MsgType = 'news';
    console.log(message.Recognition);
    const url = 'https://douban.uieee.com/v2/movie/top250&count=8';
    const {subjects} = await rp({method:'GET',url,json:true});//qs:{q:message.Content,count:8}
    if(subjects&&subjects.length){
      content = [];

      //通过遍历将数据添加进去
      for (let i = 0; i < subjects.length; i++) {
        let item = subjects[i];
        content.push({
          title: item.title,
          description1: `电影评分:${item.rating.average}`,
          PicUrl: item.images.small,
          url: item.alt
        })
      }
    }
  }else if(message.MsgType === 'video'){
    options.MsgType = 'video';
    options.MediaId = message.MediaId;

  }/*else if(message.MsgType === 'location'){
    options.MsgType = 'location'
    content = `经度为${message.Location_Y},维度为${message.Location_X},缩放大小为${message.Scale},地理信息:${message.Label}`
  }*/else if(message.MsgType === 'link'){
    options.MsgType = 'link';
    options.Title = message.Title;
    options.Description = message.Description;
    options.Url =message.Url
  }else if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      //用户订阅事件
      content = '欢迎您关注硅谷电影公众号~ \n' +
        '回复 首页 查看硅谷电影预告片 \n' +
        '回复 热门 查看最热门的电影 \n' +
        '回复 文本 搜索电影信息 \n' +
        '回复 语音 搜索电影信息 \n' +
        '也可以点击下面菜单按钮，来了解硅谷电影公众号';
    } else if (message.Event === 'unsubscribe') {
      //用户取消订阅事件
      console.log('无情取关~');
    } else if (message.Event === 'CLICK') {
      content = '您可以按照以下提示来进行操作~ \n' +
        '回复 首页 查看硅谷电影预告片 \n' +
        '回复 热门 查看最热门的电影 \n' +
        '回复 文本 搜索电影信息 \n' +
        '回复 语音 搜索电影信息 \n' +
        '也可以点击下面菜单按钮，来了解硅谷电影公众号'
    }
  }
  /*else if(message.MsgType === 'event'){
    if(message.Event === 'subscribe'){
      console.log('谢谢您的关注')
    }else if(message.Event === 'unsubscribe'){
      console.log('真遗憾您取消关注了')
    }else if(message.Event === 'SCAN'){
      content = '用户已经关注公众号，则微信会将带场景值扫描事件推送给开发者。'
    }/!*else if(message.Event === 'LOCATION'){
      content = `经度为${message.Longitude},维度为${message.Latitude},精度${message.Precision}`
    }*!/else if(message.Event === 'CLICK'){
      content = `点击事件EventKey${message.EventKey}`
    }
  }*/



  options.content = content;

  return options
}
