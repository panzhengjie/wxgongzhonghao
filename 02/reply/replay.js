module.exports = (options) =>{
  let replyMessage = `<xml>
        <ToUserName><![CDATA[${options.ToUserName}]]></ToUserName>
        <FromUserName><![CDATA[${options.FromUserName}]]></FromUserName>
        <CreateTime>${Date.now()}</CreateTime>
        <MsgType><![CDATA[${options.MsgType}]]></MsgType>`;
  if(options.MsgType === 'text'){
    replyMessage +=
        `<Content><![CDATA[${options.content}]]></Content>
      </xml>`
  }else if(options.MsgType === 'image'){
    replyMessage += `<Image>
    <MediaId><![CDATA[${options.MediaId}]]></MediaId>
  </Image>
      </xml>`
  }else if(options.MsgType === 'voice'){
    replyMessage += `<Voice>
    <MediaId><![CDATA[${options.MediaId}]]></MediaId>
  </Voice></xml>`
  }else if(options.MsgType === 'video'){
    replyMessage += `<Video>
    <MediaId><![CDATA[${options.MediaId}]]></MediaId>
    <Description><![CDATA[${options.description}]]></Description>
  </Video>
</xml>`
  }else if(options.MsgType === 'music'){
    replyMessage += `<Music>
    <ThumbMediaId><![CDATA[${options.thumbmediaid}]]></ThumbMediaId>
  </Music>
</xml>`
  }else if(options.MsgType === 'news'){
    replyMessage += `<ArticleCount>${options.content.length}</ArticleCount>
  <Articles>`;
    options.content.forEach(item=>{
      replyMessage += `<item>
      <Title><![CDATA[${item.title}]]></Title>
      <Description><![CDATA[${item.description1}]]></Description>
      <PicUrl><![CDATA[${item.PicUrl}]]></PicUrl>
      <Url><![CDATA[${item.url}]]></Url>
    </item>`
    })
    replyMessage += `</Articles></xml>`
  }
  return replyMessage




}
