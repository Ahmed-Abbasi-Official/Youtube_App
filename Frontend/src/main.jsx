import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import MainLayout from './Mainlayout/MainLayout.jsx';
import HomePage from './routes/HomePage.jsx';

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<MainLayout/>}>
      <Route path='/' element={<HomePage/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <App />
  </StrictMode>,
)
