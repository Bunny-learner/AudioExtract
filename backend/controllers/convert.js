import { asynchandler } from "../utils/asynchandler.js"
import ytdlp from 'yt-dlp-exec'

const url = asynchandler(async (req, res) => {

    const { url } = req.body
    try {
        const info = await ytdlp(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            audioFormat: 'mp3'
        });

        const audioUrl = info.url
        if(audioUrl)
        return res.json({ src: audioUrl })
        else
        return res.json({msg:"not found"})
    
    } catch (err) {
        console.log(err)
        return res.json({msg:"not found"})
       
    }
})




export { url }
