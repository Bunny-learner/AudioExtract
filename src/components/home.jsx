import React from 'react'
import './home.css'
import Spinner from './spinner.js'
import {useState} from 'react'




export default function Home() {

const [src,setsrc]=useState(" ")
const [text,settext]=useState(" ")
const [loading,setloading]=useState(false)
const [c,setc]=useState(false)
const [link,setlink]=useState("")
const [id,setid]=useState("")

  const getaudio = async () => {
    
    
    const url = document.getElementsByClassName('url')[0].value
    if(url.startsWith("https://"))
  {
    console.log("hello",url)
    setlink(url)
    setc(true)
    setloading(true)
    const videoId = extractVideoId(url);
    setid(`https://www.youtube.com/embed/${videoId}`)
    settext('Loading, please wait..... ')
    const response =await fetch("http://localhost:3000/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       url:url
      })
    })

    const msg=await response.json()
  
    if(msg.src!="not found"){
    
    setTimeout(() => {
     
      setloading(false)
      settext("You can download your audio file now.")
    }, 3000);
   
    setsrc(msg.src)}}

    else
  alert('Enter a valid Url')
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

  return (
    <div className='content'>

      <div className='search'>
        <label htmlFor="texty">Enter the Url:</label>
        
          <input type="text" onChange={look} id="texty" className="url" />
          <button onClick={getaudio}>Get</button>
      </div>

{c && (
  !loading ? (
    <>
    <div className="video">
      <h3>Youtube Video</h3>
      <iframe
  width="760"
  height="415"
  src={id}
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

    </div><br />
    <div className="audio">
      <h2>{text}</h2>
      <audio controls src={src}></audio>
    </div></>
    
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
