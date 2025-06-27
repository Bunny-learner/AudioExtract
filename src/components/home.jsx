import React, { useEffect } from 'react'
import './home.css'
import Spinner from './spinner.js'
import {useState} from 'react'


export default function Home() {



const [src,setsrc]=useState(" ")
const [videosrc,setvideosrc]=useState(" ")
const [text,settext]=useState(" ")
const [loading,setloading]=useState(false)
const [c,setc]=useState(false)
const [id,setid]=useState("")
const [ex,setex]=useState('m4a')
const [counter,setcounter]=useState(0)
const [intervalId,setIntervalId]=useState(null)
  
  const getaudio = async () => {
    
    
    const url = document.getElementsByClassName('url')[0].value
    const videoId = extractVideoId(url);
    setid(`https://www.youtube.com/embed/${videoId}`) 
  
    if(url.startsWith("https://")){


    if(ex=='m4a'){
    const format=ex
    console.log("hello",url,format)
    setc(true)
    
    setloading(true)
    settext('Loading, please wait.....Time remaining ')
    startTimer()
    
    
    const response =await fetch("http://192.168.1.2:3000/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       url:url,
       format:format
      })
    })

    const msg=await response.json()
  
    if(msg.src!="not found"){
    
    
    fetchvideo(url)
    .then((response)=>{
      console.log(response+" video")
      stopTimer()
      setloading(false)
      settext(`You can download your audio (${ex}) and video (mp4)  file now.`)
    })
    .catch((err)=>{console.log(err)
      settext('Video download option failed')
    })
      
   
  setsrc(msg.src)
  console.log(msg)}
  }
else{
setc(true);
setloading(true)

settext("loading please wait ...")
startTimer()

    triggeraudioDownload(url, ex)
  .then((response) => {
    console.log(response+" audio")
    fetchvideo(url)
    .then((response)=>{
      stopTimer()

       settext("Audio Downloading has finished. check the downloads");
    setloading(false);
    })
    .catch((err)=>{console.log(err)
      settext('Video download option failed')
    })
  })
  .catch((error) => {
    console.error(error);
    settext("Audio Download option failed.");
    })



}
}
  else
  alert('Enter a valid Url')
  }
  

  const startTimer = () => {
  setcounter(30); 
  const id = setInterval(() => {
    setcounter((prev) => {
      if (prev <= 1) {
        clearInterval(id);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  setIntervalId(id);
};

const stopTimer = () => {
  if (intervalId) clearInterval(intervalId);
  setIntervalId(null);
};

 async function triggeraudioDownload(url, format) {
  const downloadUrl = `http://192.168.1.2:3000/audio?url=${encodeURIComponent(url)}&format=${format}`;
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `audio.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  
  return {response:"success"};
}


 async function fetchvideo(url) {
  const response =await fetch(`http://192.168.1.2:3000/video?url=${encodeURIComponent(url)}`);
  const blob = await response.blob();
  const videoURL = URL.createObjectURL(blob);
  setvideosrc(videoURL);
  return {response:"success"};
}
 function extractVideoId(url) {
      const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
  function look(e){
    const text=e.target.value
    if(!text)
      setc(false)
  }

  function see(e){
    const val=e.target.value
    console.log(val)
    setex(val)
    
  }

  return (
    <div className='content'>

      <div className='search'>
        
        
          <input type="text" onChange={look} id="texty" placeholder="Enter the url" className="url" />
          <select name="format" onChange={see} id="f">
            <option selected value="m4a">Mp4</option>
            <option  value="mp3">Mp3</option>
            <option value="wav">Wav</option>
          </select>
          <button onClick={getaudio}>Get</button>
      </div>

{c && (
  !loading ? (
    <>
    <div className="video">
      <h3>Youtube Video</h3>
      <span>
         <iframe
  src={id}
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
      </span>
     

    </div><br />
    <div className="audio">
    <h2>{text}</h2>
      {src && ex=='m4a'&&<audio controls src={src}></audio>}
    </div>
    <br />
    <div className="video">
      {videosrc&&<video controls  src={videosrc}></video>}
    </div>
    </>
    
  ) : (
    <>
      <h2 className="tex">{text}{counter} Seconds.</h2>
      <Spinner />
    </>
  )
)}

    </div>
  )
}
