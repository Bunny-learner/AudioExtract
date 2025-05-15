import apk from "./app.js"
import dotenv from "dotenv"
dotenv.config()
try {
    
    apk.listen(3000,()=>{
        console.log(`listening to port 3000`)})
        
} catch (error) {
     console.log("not able to listen to the server!!")
}
    


