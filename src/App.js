import React, { useContext,useState } from 'react';
import { Outlet, NavLink,Link,  useLoaderData,useActionData, Form,redirect,useNavigation,useSubmit} from "react-router-dom";
import { useEffect } from "react";
import Menu from "./assets/menu";
import Menu2 from "./assets/menu2";
import "./App.scss"
//import {ThemeProvider} from './context/theme-context';
import Menubar2 from './assets/menubar2';
import {checkLogin} from './requests/users';
import AuthContext from './context/auth-context';
import Spingloading from './assets/spingloading';


export default function App() {
  const {Auth,handlerAuth} = useContext(AuthContext);
    const {pathname, userInfo } = useLoaderData();
    const [sidebarOn,setSidebarOn] = useState('');
    const navigation = useNavigation();
    
    const handlerSidebarOn = ()=>{
      const dataUpdate = sidebarOn ===''? 'collapse':'';
      setSidebarOn(dataUpdate);
    }

    if(!Auth.token){
      return(
            <Outlet/>
      );
    }


    return (
      <>
          <Menu2 sidebar={sidebarOn} /> 
          <div className='container-fluid background-default'>
            <div className='row'>
                  <Menubar2 sidebarON={handlerSidebarOn} />
                  {navigation.state === "loading"?<><Spingloading /></>:<><Outlet/></>}
            </div>
          </div>
      </>
    );
  }