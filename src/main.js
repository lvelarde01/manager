import React from 'react'
import App from "./App"
import {AuthProvider} from './context/auth-context'
import { ThemeProvider } from './context/theme-context'
import { checkLogin } from './requests/users'
import { redirect } from 'react-router-dom'
export async function loader({ request }){
  const userInfo = await checkLogin();
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  if(!userInfo.token && pathname === "/register"){
    return {work:"yes"};
  }else if(!userInfo.token && pathname !== "/login"){
    return redirect("/login");
  }else if(userInfo.token && pathname === "/login"){
    return redirect("/");
  }
  return {pathname,userInfo};
} 
export default function Main() {
  return (
    <ThemeProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ThemeProvider>        

  )
}
