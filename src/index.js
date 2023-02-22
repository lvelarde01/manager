import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
//import './App.scss';
//BASE
import ErrorPage, {loader as errorLoader} from "./error-page";
import Home from "./routes/home";
import Configui from './routes/users/configui';
import Login,{loader as loaderLogin} from './routes/users/login';
import Logout,{loader as loaderLogout} from './routes/users/logout';
import Main , {loader as loaderMain} from  './main';
import Profile,{action as actionProfile,loader as loaderProfile} from './routes/users/profile';
//Users
import {Add as UserRegister,loader as loaderUser} from "./routes/users/add";
import {Edit as UserEdit, loader as loaderUserEdit} from './routes/users/edit'; 
import {Index as IndexUser} from "./routes/users/index";
import Register,{action as actionRegister} from './routes/users/register';
import Password ,{action as actionPassword} from './routes/password';
//WareHouse
import {Add as WareHouseRegister, loader as loaderWareHouse, action as actionWareHouse} from './routes/warehouse/add'; 
import {Index as WareHouseIndex, loader as loaderWareHouseIndex} from './routes/warehouse/index'; 
import {Edit as WareHouseEdit, loader as loaderWareHouseEdit} from './routes/warehouse/edit';
//container 
import {Add as ContainerRegister, loader as loaderContainer, action as actionContainer} from './routes/container/add';
import {Index as ContainerIndex, loader as loaderContainerIndex} from './routes/container/index';
import {Edit as ContainerEdit, loader as loaderContainerEdit} from './routes/container/edit'; 
//collection
import {Add as CollectionRegister, loader as loaderCollection, action as actionCollection} from './routes/collection/add';
import {Index as CollectionIndex, loader as loaderCollectionIndex} from './routes/collection/index';
import {Edit as CollectionEdit, loader as loaderCollectionEdit} from './routes/collection/edit'; 
//Workers
import {Add as WorkersRegister, loader as loaderWorkers, action as actionWorkers} from './routes/workers/add';
import {Index as WorkersIndex, loader as loaderWorkersIndex} from './routes/workers/index';
import {Edit as WorkersEdit, loader as loaderWorkersEdit} from './routes/workers/edit'; 
//vps
import {Add as VpsRegister, loader as loaderVps, action as actionVps} from './routes/vps/add';
import {Index as VpsIndex, loader as loaderVpsIndex} from './routes/vps/index';
import {Edit as VpsEdit, loader as loaderVpsEdit} from './routes/vps/edit'; 
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
            element: <UserRegister />,
            loader: loaderUser,
          },
          {
            path: "/users/edit/:id",
            loader: loaderUserEdit,
            element: <UserEdit />,
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
            path: "/password/:token",
            loader: actionPassword,
            element: <Password />,
          },
          //WareHouse
          {
            path: "/warehouse/add",
            loader: loaderWareHouse,
            action: actionWareHouse,
            element: <WareHouseRegister />,
          },
          {
            path: "/warehouse/",
            loader: loaderWareHouseIndex,
            element: <WareHouseIndex />,
          },
          {
            path: "/warehouse/edit/:id",
            loader: loaderWareHouseEdit,
            element: <WareHouseEdit />,
          },
          //container
          {
            path: "/container/add",
            loader: loaderContainer,
            element: <ContainerRegister />,
          },
          {
            path: "/container/",
            loader: loaderContainerIndex,
            element: <ContainerIndex />,
          },
          {
            path: "/container/edit/:id",
            loader: loaderContainerEdit,
            element: <ContainerEdit />,
          },
          //collection
          {
            path: "/collection/add",
            loader: loaderCollection,
            element: <CollectionRegister />,
          },
          {
            path: "/collection/",
            loader: loaderCollectionIndex,
            element: <CollectionIndex />,
          },
          {
            path: "/collection/edit/:id",
            loader: loaderCollectionEdit,
            element: <CollectionEdit />,
          },
          //Workers
          {
            path: "/workers/add",
            loader: loaderWorkers,
            element: <WorkersRegister />,
          },
          {
            path: "/workers/",
            loader: loaderWorkersIndex,
            element: <WorkersIndex />,
          },
          {
            path: "/workers/edit/:id",
            loader: loaderWorkersEdit,
            element: <WorkersEdit />,
          },
          //vps
          {
            path: "/vps/add",
            loader: loaderVps,
            element: <VpsRegister />,
          },
          {
            path: "/vps/",
            loader: loaderVpsIndex,
            element: <VpsIndex />,
          },
          {
            path: "/vps/edit/:id",
            loader: loaderVpsEdit,
            element: <VpsEdit />,
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
