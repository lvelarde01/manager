import React, { useContext } from 'react'
import { redirect,useLoaderData } from 'react-router-dom';
import {clearUser,checkLogin} from '../../requests/users'
import AuthContext,{IninitialAuth} from '../../context/auth-context';
export async function loader({ request }) {
    const userLogout = await clearUser();
    return redirect("/");
    
}
export default function Logout() {
  
  return (
    <div>
      <h1>Logout </h1>
    </div>
  )
}
