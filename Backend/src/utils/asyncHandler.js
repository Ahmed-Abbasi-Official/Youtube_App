const asyncHandler=(fn)=> async(req,res,next)=>{
try {
    await fn(req,res,next)
} catch (error) {
    console.log(error.message);
    
   return res.status(500).json({
        status:false,
        message:error.message
    })
}
}

export {asyncHandler}