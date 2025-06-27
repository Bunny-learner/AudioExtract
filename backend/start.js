import apk from "./app.js"
import dotenv from "dotenv"
dotenv.config()
try {
    
    apk.listen(PORT,()=>{
        console.log(`listening to port ${PORT}`)})
        
} catch (error) {
     console.log("not able to listen to the server!!")
}
    


