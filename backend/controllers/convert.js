import { asynchandler } from "../utils/asynchandler.js"
import fs from 'fs'
import os from 'os'
import { create } from 'yt-dlp-exec';
import { fileURLToPath } from 'url';
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ytdlpPath = path.join(__dirname, '../bin/yt-dlp'); // adjust if needed
console.log(ytdlpPath,typeof ytdlpPath)
console.log("..................")
console.log("📍 yt-dlp path:", ytdlpPath); 
console.log("📎 Exists?", fs.existsSync(ytdlpPath)); 
console.log("................")
const custom = create(ytdlpPath);
console.log(custom)


const diffurl = asynchandler(async (req, res) => {
  const url = req.query.url;
  const format = req.query.format;
  await audio(url, format, res)
    .then(() => {
      console.log("✅ success mp3");
    });
});

const debug = asynchandler(async (req, res) => {
  const temp = os.tmpdir();
  const files = fs.readdirSync(temp);
  console.log("🧠 Temp Directory:", temp);
  console.log("📁 Files in temp:", files);
  return res.json({ tmpDir: temp, files });
});

const videosend = asynchandler(async (req, res) => {
  const url = req.query.url;
  await video(url, res)
    .then(() => {
      console.log("✅ success video mp4");
    });
});

function clean() {
  let directory = os.tmpdir();
  console.log("🧹 Cleaning:", directory);
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
        console.error(`❌ Failed to delete ${filePath}:`, err);
      }
    }
  }
}

async function downloadvideo(u) {
  const outputpath = path.join(os.tmpdir(), 'videooutput.%(ext)s');
  try {
    await custom(u, {
      format: 'bestvideo+bestaudio/best',
      output: outputpath,
      noCheckCertificates: true,
      forceOverwrites: true,
      noCacheDir: true
    });

    const files = fs.readdirSync(os.tmpdir());
    const videoFile = files.find(f => f.startsWith('videooutput.'));
    if (videoFile) {
      const fullPath = path.join(os.tmpdir(), videoFile);
      console.log("📥 Video downloaded to:", fullPath);
      console.log("📎 Exists?", fs.existsSync(fullPath));
      return fullPath;
    } else {
      console.log("❌ Video file not found after yt-dlp.");
      return null;
    }
  } catch (e) {
    console.error("❌ yt-dlp video download error:", e);
    return null;
  }
}

async function convert(u, which) {
  try {
    const audioFormat = which;
    clean();
    const outputFile = path.join(os.tmpdir(), `output.${audioFormat}`);

    await custom(u, {
      extractAudio: true,
      audioFormat,
      output: outputFile,
      noCheckCertificates: true,
      noPlaylist: true
    });

    const exists = fs.existsSync(outputFile);
    console.log(`📥 Audio downloaded to: ${outputFile}`);
    console.log(`📎 Exists?`, exists);

    return exists ? outputFile : null;
  } catch (error) {
    console.error('❌ Error in convert():', error);
    return null;
  }
}

async function audio(u, format, res) {
  console.log("🎧 inside the sending audio");
  const filePath = await convert(u, format);

  if (filePath && fs.existsSync(filePath)) {
    return res.download(filePath, (err) => {
      if (err) {
        console.error("❌ Error sending file:", err);
        res.status(500).send("Download error");
      }
    });
  } else {
    console.log("⚠️ Audio file not found or empty");
    return res.status(404).json({ msg: "File not found" });
  }
}

async function video(u, res) {
  const filePath = await downloadvideo(u);
  console.log("🎬 inside the sending video");

  if (filePath && fs.existsSync(filePath)) {
    return res.sendFile(filePath, (err) => {
      if (err) {
        console.error("❌ Error sending video file:", err);
        res.status(500).send("Download error");
      }
    });
  } else {
    console.log("⚠️ Video file not found or empty");
    return res.status(404).json({ msg: "File not found" });
  }
}

const url = asynchandler(async (req, res) => {
  let { format } = req.body;
  const u = req.body.url;

  try {
    if (!fs.existsSync(ytdlpPath)) {
  console.error("❌ yt-dlp binary not found at:", ytdlpPath);
  return res.status(500).json({ msg: "yt-dlp binary not found" });
}

    const info = await custom(u, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      format: 'bestaudio[ext=m4a]'
    });

    let audioUrl = info.url;
    if (format === 'm4a') {
      console.log("🔗 Direct audio URL:", audioUrl);
      return res.json({ src: audioUrl });
    }
  } catch (err) {
    console.log("❌ Error fetching metadata:", err);
    return res.json({ msg: "not found" });
  }
});

export { url, diffurl, videosend, debug };
