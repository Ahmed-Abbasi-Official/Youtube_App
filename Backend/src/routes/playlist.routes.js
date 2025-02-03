import { Router } from "express";
import { createPlaylist, deletePlaylist, getPlaylists, getSinglePlaylist, togglePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/isAuth.middleware.js";

const router = Router();

// CREATE NEW PLAYLIST
router.route('/create-new-playlist').post( verifyJWT , createPlaylist )

// GET ALL PLAYLISTS
router.route('/').get( verifyJWT , getPlaylists )

// DELETE PLAYLISTS
router.route('/:id').delete( verifyJWT , deletePlaylist )

// TOGGLE PLAYLIST
router.route('/toggle-playlist/:id').patch( verifyJWT , togglePlaylist )

// GET SINGLE PLAYLIST
router.route('/playlist/:id').get( verifyJWT , getSinglePlaylist )


export default router;
