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
import {Edit as EditUser,loader as EditUserLoader} from "./routes/users/edit";
import {Index as IndexUser,loader as userIndexLoader} from "./routes/users/index";
import Configui from './routes/users/configui';
import Login,{loader as loaderLogin} from './routes/users/login';
import Logout,{loader as loaderLogout} from './routes/users/logout';
import Main , {loader as loaderMain} from  './main';
import Profile,{action as actionProfile,loader as loaderProfile} from './routes/users/profile';
import Register,{action as actionRegister} from './routes/users/register';
import { Password as ChangePassword, loader as passwordLoader } from './routes/users/password';
import Password ,{action as actionPassword} from './routes/password';
import {Home as ClientHome,loader as ClientHomeLoader} from './routes/clients/home';
import {Profile as StoreProfile,loader as StoreProfileLoader} from './routes/stores/profile';
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
            loader: userIndexLoader,
            element: <IndexUser />,
          },
          {
            path: "/users/add",
            element: <Add />,
            loader: addLoader,
            action: addAction,
          },
          {
            path: "/users/edit/:id",
            loader: EditUserLoader,
            element: <EditUser />,
          },
          {
            path:"/users/password",
            element: <ChangePassword />,
            loader:passwordLoader
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
            loader:loaderLogin,
            element: <Login />,
          },
          {
            path: "/logout",
            loader:loaderLogout,
            element: <Logout />,
          },
          {
            path: "/register",
            loader: actionRegister,
            element: <Register />,
          },
          {
            path: "/home",
            loader: ClientHomeLoader,
            element: <ClientHome />,
          },
          {
            path: "/password/:token",
            loader: actionPassword,
            element: <Password />,
          },
          {
            path: "/stores/profile/:token",
            loader: StoreProfileLoader,
            element: <StoreProfile />,
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
