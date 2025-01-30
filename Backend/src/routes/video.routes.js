import { Router } from "express";
import { dashboardData, deleteVideo, getAllVideos, getSingleVideo, getVideosByUser, updateVideo, uploadVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/isAuth.middleware.js";
import increaseVisits from "../middlewares/increaseViews.js";

const router = Router();

// UPLOAD ROUTE
router.route('/upload-video').post( verifyJWT , upload.single("video") , uploadVideo)

// GET ALL VIDEOS
router.route('/').get(getAllVideos) ;

// GET SINGLE VIDEO
router.route('/:slug').get( increaseVisits , getSingleVideo )

// DELETE SINGLE VIDEO
router.route('/:id').delete( verifyJWT , deleteVideo) ;

// GET SELECTED USER VIDEOS
router.route('/user/:username').get(getVideosByUser);

// UPDATE VIDEO
router.route('/user/update/:id').patch( verifyJWT , upload.single('video') , updateVideo);

// GET DASHBOARD
router.route('/dashboard/data').get( verifyJWT , dashboardData)


export default router;
