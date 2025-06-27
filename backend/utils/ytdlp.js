// backend/utils/ytdlp.js
import { create } from 'yt-dlp-exec';

const ytdlp = create({
  binary: './bin/yt-dlp', // Assuming you added yt-dlp manually here
});

export default ytdlp;
