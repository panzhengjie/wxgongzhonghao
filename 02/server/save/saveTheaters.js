
let TheatersModle = require('../../modle/Theaters');//引入约束
module.exports = async (data)=>{
  for (let i = 0; i < data.length; i++) {
    let datum = data[i]
    const result = await TheatersModle.create({
      title: datum.title,
      rating: datum.score,
      runtime:datum.runtime,
      director: datum.director,
      actors: datum.actors,
      doubanId:datum.doubanId,
      href:datum.href,
      src:datum.src,
      genre: datum.genre,
      summery:datum.summery,
      releaseDate:datum.releaseDate
    })
    console.log('保存成功')
  }
}
