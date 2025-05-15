import React from 'react'
import './home.css'
import Spinner from './spinner.js'
import {useState} from 'react'




export default function Home() {

const [src,setsrc]=useState(" ")
const [text,settext]=useState(" ")
const [loading,setloading]=useState(false)
const [c,setc]=useState(false)
const [id,setid]=useState("")
const [ex,setex]=useState('m4a')

  const getaudio = async () => {
    
    
    const url = document.getElementsByClassName('url')[0].value
     const videoId = extractVideoId(url);
    setid(`https://www.youtube.com/embed/${videoId}`) 

    if(url.startsWith("https://"))
  {


    if(ex=='m4a'){
    const format=ex
    console.log("hello",url,format)
    setc(true)
    
    setloading(true)
   
    settext('Loading, please wait..... ')
    const response =await fetch("http://localhost:3000/url", {
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
    
    setTimeout(() => {
     
      setloading(false)
      settext(`You can download your audio ${ex} file now.`)
    }, 500);
   
    setsrc(msg.src)}
  console.log(msg.src)}

else{
setc(true);
settext("Wait few seconds");
console.log(id)
setTimeout(async () => {
  await triggerDownload(url, ex);
  settext("Downloading has finished.");
}, 1000);

}
  }
  else
  alert('Enter a valid Url')
  }

 async function triggerDownload(url, format) {
  const downloadUrl = `http://localhost:3000/diffurl?url=${encodeURIComponent(url)}&format=${format}`;
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `audio.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  
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
    setex(val)
  }

  return (
    <div className='content'>

      <div className='search'>
        <label htmlFor="texty">Enter the Url:</label>
        
          <input type="text" onChange={look} id="texty" className="url" />
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
  width="760"
  height="415"
  src={id}
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
      </span>
     

    </div><br />
    <div className="audio">
      <h2>{text}</h2>
      {src &&<audio controls src={src}></audio>}
    </div>
    </>
    
  ) : (
    <>
      <h2>{text}</h2>
      <Spinner />
    </>
  )
)}

    </div>
  )
}
