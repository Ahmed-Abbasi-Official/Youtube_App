import { Router } from "express";

import { dashboardData, deleteVideo, getAllVideos, getSingleVideo, getVideosByCategory, getVideosByUser, searchVideos, subs, toggleSubscription, unsubs, updateVideo, uploadVideo, userLikedVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/isAuth.middleware.js";
import increaseVisits from "../middlewares/increaseViews.js";

const router = Router();

// UPLOAD ROUTE
router.route('/upload-video').post( verifyJWT , upload.fields([{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }])
, uploadVideo)

// GET ALL VIDEOS
router.route('/').get(getAllVideos) ;

// GET SINGLE VIDEO
router.route('/:slug').get( verifyJWT ,  increaseVisits , getSingleVideo )

// DELETE SINGLE VIDEO
router.route('/:id').delete( verifyJWT , deleteVideo) ;

// GET SELECTED USER VIDEOS
router.route('/user/:username').get(getVideosByUser);

// UPDATE VIDEO
router.route('/user/update/:id').patch( verifyJWT , upload.single('video') , updateVideo);

// GET DASHBOARD
router.route('/dashboard/data').get( verifyJWT , dashboardData)

// TOGGLE SUBSCRIPTION
router.route('/subscription/:channelId').get( verifyJWT , toggleSubscription );

// USER LIKED VIDEOS
router.route('/liked').post( verifyJWT , userLikedVideo)

// UNSUBS
router.route('/unsubscription/:channelId').post(verifyJWT , unsubs );

// SUBS
router.route('/subscription/:channelId').post(verifyJWT , subs );

// SEARCH
router.route('/videos/search').get(searchVideos)

// GET VIDEOS BY CAT
router.route('/videos/category/:category').get(verifyJWT, getVideosByCategory)


export default router;
