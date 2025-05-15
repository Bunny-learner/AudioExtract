import { asynchandler } from "../utils/asynchandler.js"
import ytdlp from 'yt-dlp-exec'

import path from 'path'

const diffurl=asynchandler(async(req,res)=>{
const url = req.query.url;
const format = req.query.format;
await audio(url,format,res)
.then(()=>{
    console.log("success mp3")
})

})
async function convert(u, which) {
  try {
    
    const audioFormat = which; 
    
    const outputFile = path.resolve('downloads', `output.${audioFormat}`);

    await ytdlp(u, {
      extractAudio: true,
      audioFormat,
      output: outputFile,
      noCheckCertificates: true,
      noPlaylist: true,
    });

    return outputFile;  
  } catch (error) {
    console.error('Error in convert():', error);
    return null;
  }
}

async function audio(u,format,res){
const path = await convert(u, format);

if (path) {
  return res.download(path, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Download error");
    }
  });
} else {
  return res.status(404).json({ msg: "File not found" });
}
}


const url = asynchandler(async (req, res) => {

    let { format } = req.body
    const u=req.body.url


    try {
        const info = await ytdlp(u, {
    dumpSingleJson: true,
    noCheckCertificates: true,
    format: 'bestaudio[ext=m4a]'
});



    

        let audioUrl=info.url;
        if(format==='m4a'){
            console.log(audioUrl)
        return res.json({src:audioUrl})
    }


    } catch (err) {
        console.log(err)
        return res.json({ msg: "not found" })

    }
})




export { url ,diffurl}
