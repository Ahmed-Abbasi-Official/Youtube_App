import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/User.Context.jsx";
import { VideoProvider } from "./context/Videos.Context.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import MainLayout from "./Mainlayout/MainLayout.jsx";
import HomePage from "./routes/HomePage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import { ToastContainer } from 'react-toastify';
import LoginPage from "./routes/LoginPage.jsx";
import MyChannel from "./routes/MyChannel.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import SingleVideo from "./routes/SingleVideo.jsx";



const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/:username" element={<MyChannel />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/video/:videoId" element={<SingleVideo />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
    <UserProvider>
      <VideoProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" />
      </VideoProvider>
      <App />
    </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
