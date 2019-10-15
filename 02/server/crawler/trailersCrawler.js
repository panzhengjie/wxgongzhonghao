const puppeteer = require('puppeteer');
//爬取预告片电影信息
const url = 'https://movie.douban.com/coming';
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
    const $item = $('.coming_list tr');

    for (let i = 0; i < $item.length; i++) {
      let lidom = $item[i];
      const num = parseInt($(lidom).find('td').last().html());
      if(num>1000){ //想观看人数超过100的电影
        let href = $(lidom).find('a').attr('href');//电影链接
        result.push({
          href
        });
      }

    }
    return result
  });
  //console.log(result);

  //所有电影数据的数组
  let moviesData = [];
  //遍历收集到的电影链接
  for (let i = 0; i < result.length; i++) {
    let url = result[i].href; //电影点击后的链接
    console.log(url);
    await page.goto(url,{
      waitUntil:'networkidle2' //等待网络空闲时间，在跳转加载页面
    });
    //4.爬取数据
    let itemResult = await page.evaluate(()=> {
      //预告片
      const href = $('.related-pic-video').attr('href');
      //豆瓣id
      let doubanId = $('.a_show_login.lnk-sharing').attr('share-id');
      if (!href ||!doubanId) {
        return false;
      }
      //电影标题
      let title = $('[property="v:itemreviewed"]').html();
      //导演
      let  directors = $('[rel="v:directedBy"]').html();
      //海报图
      let src = $('[rel="v:image"]').attr('src');

      //演员
      let casts = [];
      let $starring= $('[rel="v:starring"]');
      $starring.length>=3?3: $starring.length;
      for (let j = 0; j < $starring.length; j++) {
        casts.push($starring[j].innerText);
      };
      //类型
      let genre = [];
      const $genre = $('[property="v:genre"]');
      for (let j = 0; j < $genre.length; j++) {
        genre.push($genre[j].innerText);
      };
      //上映时间
      const releaseDate = $('[property="v:initialReleaseDate"]')[0].innerText;
      //简介
      let summery=$('[property="v:summary"]').html().replace(/\s+/g,'');
      //片长
      let runtime = $('[property="v:runtime"]').html();
      //评分
      const rating = $('[property="v:average"]').html();

      //预告片封面
      const cover = $('.related-pic-video').css('background-image').split('"')[1].split('?')[0];;
      return {
        title,
        rating,
        cover,
        href,
        doubanId,
        casts,
        runtime,
        src,
        directors,
        genre,
        summery,
        releaseDate
      }
    })
    if (itemResult) {
      moviesData.push(itemResult);
    }
  }



  //预告片电影链接
  for (let i = 0; i < moviesData.length; i++) {
    let item = moviesData[i];
    let url = item.href;
    //跳转到电影详情页
    await page.goto(url, {
      waitUntil: 'networkidle2'  //等待网络空闲时，在跳转加载页面
    });
    //爬取其他数据
    item.link = await page.evaluate(() => {
      //电影链接
      let link = $('video>source').attr('src');
      return link
    })
  }
  console.log(moviesData)
  //关闭浏览器
  await browser.close();
  return moviesData
}
function timeout() {
  return new Promise(resolve => setTimeout(resolve,5000))
}
