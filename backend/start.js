import apk from "./app.js"
import dotenv from "dotenv"
dotenv.config()
import { execSync } from 'child_process';

try {
  const result = execSync('ls -l ./backend/bin/yt-dlp').toString();
  console.log('🔍 yt-dlp permissions:\n', result);
} catch (err) {
  console.error('❌ Failed to check yt-dlp permissions', err.message);
}

const PORT = process.env.PORT || 5000;
try {
    
    apk.listen(PORT,()=>{
        console.log(`listening to port ${PORT}`)})
        
} catch (error) {
     console.log("not able to listen to the server!!")
}
    


