import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./context/User.Context";
import { VideoProvider } from "./context/Videos.Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import MainLayout from "./Mainlayout/MainLayout";
import HomePage from "./routes/HomePage";
import RegisterPage from "./routes/RegisterPage";
import LoginPage from "./routes/LoginPage";
import MyChannel from "./routes/MyChannel";
import Dashboard from "./routes/Dashboard";
import SingleVideo from "./routes/SingleVideo";
import { ToastContainer } from "react-toastify";
import { PlaylistProvider } from "./context/Playlist.Context";
import { CommentsProvider } from "./context/Comment.Context";
import LikedVideos from "./routes/LikedVideos";
import WatchHistory from "./routes/WatchHistory";
import Playlists from "./routes/PLaylists";
import PlaylistVideos from "./components/PlaylistVideos";
import SubscribersAndSubscribed from "./routes/SubscribersAndSubscribed";
import Collection from "./routes/Collection";


const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/:username" element={<MyChannel />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/video/:slug" element={<SingleVideo />} />
      <Route path="/video/liked-videos" element={<LikedVideos />} />
      <Route path="/video/history" element={<WatchHistory />} />
      <Route path="/video/playlist" element={<Playlists />} />
      <Route path="/video/playlist/:id" element={<PlaylistVideos />} />
      <Route path="/user/subcribers" element={<SubscribersAndSubscribed />} />
      <Route path="/collection" element={<Collection />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <VideoProvider>
        <PlaylistProvider>
        <CommentsProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-right" />
        </CommentsProvider>
        </PlaylistProvider>
        </VideoProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
