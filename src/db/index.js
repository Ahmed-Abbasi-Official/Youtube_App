import mongoose  from "mongoose";
import {db} from "../constants.js";

const connectDB=async()=>{
    
    try {
      const connectionInstance=  await mongoose.connect(`${process.env.MONGODB_URI}/${db}}`)
        console.log(`\n MongoDB Connected !! DB HOST : 
            ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB ERROR : ===> ",error);
        throw error
        
    }
}

export default connectDB