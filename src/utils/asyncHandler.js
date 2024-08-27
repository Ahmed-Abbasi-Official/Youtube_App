        // Promise Approach

const asyncHandler = (requstHandler)=>{
    (req,res,next)=>{
        Promise.resolve(
            requstHandler(req,res,next)
        ).catch((error)=>{
        return    next(error)
        })
    }
}

export {asyncHandler}

        // High Order Function Approach 
/* 
const asyncHandler=(fn)=>async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success:true,
            message:error.message
        })
    }
}
*/