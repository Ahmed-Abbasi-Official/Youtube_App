import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/User.Context.jsx";
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



const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
    <UserProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" />
      <App />
    </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
