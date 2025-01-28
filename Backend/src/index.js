import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js'

// ENV CONFIG

// import dotenv from "dotenv";
dotenv.config(); // Default path: .env in root

// DATABASE CONNECTION

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Your Server is Listen Port At : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(`Connection Failed : ${err}`);
    
});

































/*

        1st Approach

import express from 'express'
const app = express()

        // IIFFE

;(async()=>{
   try {
    await mongoose.connect(`${process.env.MONGGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.log("ERR : ===> ",error);
        throw error
    })
    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port : ${process.env.PORT}`);
        
    })
   } catch (error) {
    console.log("ERROR : ===> ",error);
    throw error
    
   }
})()
   */
