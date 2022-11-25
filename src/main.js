import React from 'react'
import App from "./App"
import {AuthProvider} from './context/auth-context'
import { ThemeProvider } from './context/theme-context'
import { checkLogin } from './requests/users'
import { redirect } from 'react-router-dom'
export async function loader({ request }){
  const {token} = await checkLogin();
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  if(!token && pathname !== "/login"){
    return redirect("/login");
  }
  if(token && pathname === "/login"){
    return redirect("/");
  }
  return {pathname,token};
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
