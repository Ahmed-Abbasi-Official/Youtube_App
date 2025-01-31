import mongoose from "mongoose";
import { Schema } from "mongoose";

const commnetSchema = new Schema({
    comment:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:'Video',
        required:true
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ]

},{
    timestamps:true,
})

export const Comment = mongoose.model('Comment', commnetSchema);