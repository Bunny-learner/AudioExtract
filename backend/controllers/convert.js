import { asynchandler } from "../utils/asynchandler.js"
import ytdlp from 'yt-dlp-exec'
import fs from 'fs'
import path from 'path'
import os from 'os'

const diffurl=asynchandler(async(req,res)=>{
const url = req.query.url;
const format = req.query.format;
await audio(url,format,res)
.then(()=>{
    console.log("success mp3")
})

})


const videosend=asynchandler(async(req,res)=>{
const url = req.query.url;
await video(url,res)
.then(()=>{
    console.log("success video mp4")
})

})

function clean(){
  let directory=path.resolve(os.tmpdir())
if (fs.existsSync(directory)) {

  const files = fs.readdirSync(directory);

for (const file of files) {
  const filePath = path.join(directory, file);
  try {
    const stat = fs.lstatSync(filePath);
    if (stat.isFile()) {
      fs.unlinkSync(filePath);
    } else if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  } catch (err) {
    console.error(`Failed to delete ${filePath}:`, err);
  }
}

}
}

async function downloadvideo(u) {
  const outputpath= path.resolve(os.tmpdir(), 'videooutput.%(ext)s')

    await ytdlp(u, {
      format: 'bestvideo+bestaudio/best',
      output: outputpath,
      noCheckCertificates: true,
      forceOverwrites:true,
    noCacheDir: true})
    
    const files = fs.readdirSync(os.tmpdir());
    const videoFile = files.find(f => f.startsWith('videooutput.'));
    
    if (videoFile) {
      const fullPath = path.resolve(os.tmpdir(), videoFile);
      console.log(" Video downloaded to:", fullPath);
      return fullPath;
}
else{
  console.log("error at video downloading")
}

}
async function convert(u,which) {
  try {
    
    const audioFormat = which; 

clean()

    const outputFile = path.resolve(os.tmpdir(), `output.${audioFormat}`);

    await ytdlp(u, {
      extractAudio: true,
      audioFormat,
      output: outputFile,
      noCheckCertificates: true,
      noPlaylist: true,
    })
    
    return outputFile

  } catch (error) {
    console.error('Error in convert():', error);
    return null;
  }
}

async function audio(u,format,res){
console.log("inside the sending audio")
const path = await convert(u, format);

if (path.length!=0) {
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


async function video(u,res){
const filePath = await downloadvideo(u);
console.log("inside the sending video")

if (filePath && filePath.length !== 0) {
    return res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending video file:", err);
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




export { url ,diffurl,videosend}
