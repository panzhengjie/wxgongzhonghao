//引入Trailers
const Trailers = require('../../modle/Trailers');

module.exports = async data => {

  for (var i = 0; i < data.length; i++) {
    let item = data[i];

    await Trailers.create({
      title: item.title,
      rating: item.rating,
      runtime: item.runtime,
      directors: item.directors,
      casts: item.casts,
      src: item.src,
      doubanId: item.doubanId,
      cover: item.cover,
      genre: item.genre,
      summery: item.summery,
      releaseDate: item.releaseDate,
      href: item.href,
      link:item.link
    });

    console.log('数据保存成功');

  }

}
