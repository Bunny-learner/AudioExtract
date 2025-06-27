import apk from "./app.js"
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 5000;
try {
    
    apk.listen(PORT,()=>{
        console.log(`listening to port ${PORT}`)})
        
} catch (error) {
     console.log("not able to listen to the server!!")
}
    


