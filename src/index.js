import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
//import './App.scss';
//BASE
import App,{loader as appLoader} from './App';
import ErrorPage, {loader as errorLoader} from "./error-page";
import Home from "./routes/home";
import Add,{loader as addLoader, action as addAction} from "./routes/users/add";
import {index as IndexUser} from "./routes/users/index";
import Configui from './routes/users/configui';
import Login,{action as actionLogin,loader as loaderLogin} from './routes/users/login';
import Logout,{loader as loaderLogout} from './routes/users/logout';
import Main , {loader as loaderMain} from  './main';
import Profile,{action as actionProfile,loader as loaderProfile} from './routes/users/profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    loader: loaderMain,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { 
            index: true,
            element: <Home /> 
          },
          {
            path: "/users",
            element: <IndexUser />,
          },
          {
            path: "/users/add",
            element: <Add />,
            loader: addLoader,
            action: addAction,
          },
          
          
          {
            path: "/users/config",
            element: <Configui />,
          },
          {
            path: "/profile",
            action:actionProfile,
            loader:loaderProfile,
            element: <Profile />,
          },
          {
            path: "/login",
            action:actionLogin,
            loader:loaderLogin,
            element: <Login />,
          },
          {
            path: "/logout",
            loader:loaderLogout,
            element: <Logout />,
          },
          {
            path: "*",
            loader: errorLoader,
            errorElement: <ErrorPage />,
          },
          /* the rest of the routes */
        ],
      },
      
    ],
  },
  
]);

if(router){
  console.log("data root");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
   </React.StrictMode>
);
