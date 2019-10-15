const puppeteer = require('puppeteer');
//爬取热门电影信息
const url = 'https://movie.douban.com/cinema/nowplaying/beijing/';
module.exports = async () => {
  //1.打开浏览器
  const browser = await puppeteer.launch({
      //headless: false
      args: ['--no-sandbox'], //不打开浏览器
    });
  //2.新建标签页
  const page = await browser.newPage();
  //3.跳转到指定页面
  await page.goto(url,{
    waitUntil:'networkidle2' //等待网络空闲时间，在跳转加载页面
  });
  //4.爬取数据
  await timeout();//设置等待时间
  let result = await page.evaluate(()=>{
    let result = [];
    const $item = $('#nowplaying>.mod-bd>.lists>.list-item')
    for (let i = 0; i < 8; i++) {
      let lidom = $item[i]
      let title =$(lidom).data('title');//自定义属性的查找方法
      let score = $(lidom).data('score');
      //电影片长
      let runtime = $(lidom).data('duration')
      //豆瓣id
      let doubanId = $(lidom).data('subject');
      let director = $(lidom).data('director');
      let actors = $(lidom).data('actors');
      let href = $(lidom).find('.poster>a').attr('href');
      let src = $(lidom).find('.poster>a>img').attr('src');
      result.push({
        title,
        score,
        director,
        runtime,
        doubanId,
        actors,
        href,
        src,
      })
    }
    return result
  });
  console.log(result);
  //遍历收集到的数据
  for (let i = 0; i < result.length; i++) {
    let item = result[i]; //每个对象
    let url = item.href; //点击后的链接
    await page.goto(url,{
      waitUntil:'networkidle2' //等待网络空闲时间，在跳转加载页面
    });
    //4.爬取数据
    let itemResult = await page.evaluate(()=> {
      let genre = [];
      let $genre= $('[property="v:genre"]');
      for (let j = 0; j < $genre.length; j++) {
        genre.push($genre[j].innerText)
      }
      let summery=$('[property="v:summary"]').html().replace(/\s+/g,'');
      const releaseDate = $('[property="v:initialReleaseDate"]')[0].innerText;
      return {
        genre,
        summery,
        releaseDate
      }
    })
    console.log(itemResult)
    item.genre = itemResult.genre;
    item.summery = itemResult.summery;
    item.releaseDate = itemResult.releaseDate;
  }
/*
  console.log(result)
*/
  //关闭浏览器
  await browser.close();
  return result
}
function timeout() {
  return new Promise(resolve => setTimeout(resolve,5000))
}
