import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = [process.env.AllowedOrigin1, process.env.AllowedOrigin2];

// CORS configuration

const corsOptions = {
  origin: (origin, callback) => {
      // console.log("origin ==>", origin);

      if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
      } else {
          console.error(`Blocked by CORS: ${origin}`);
          callback(new Error("Not allowed by CORS"));
      }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Fixed here
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionSuccessStatus: 200,
};


app.use(cors(corsOptions));

// MIDDLEWARES

app.use(express.json({limit: "16kb",}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// ROUTES IMPORT ;

import userRoutes from './routes/user.routes.js';
import videosRoutes from './routes/video.routes.js';
import playlistRoutes from './routes/playlist.routes.js';

// ROUTES DICLERATION ;

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/videos',videosRoutes);
app.use('/api/v1/playlist',playlistRoutes);

export { app };
