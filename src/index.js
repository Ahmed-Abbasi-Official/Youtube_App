import dotenv from "dotenv";

import connectDB from "./db/index.js";
dotenv.config({ path: "./.env" });

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Server Connection Error !!!  : ===> ",error);
        throw error
    })
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
        
    })
})
.catch((error)=>{
    console.log('MongoDB Connection Error !!! : ',error);
    
})

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
