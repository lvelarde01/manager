import React,{createContext,useState,useEffect} from "react";
import { checkLogin } from "../requests/users";

const AuthContext = createContext();

export const IninitialAuth = {username:null,token:null,id:null};

const AuthProvider = ({children}) =>{
    const [Auth,setAuth] = useState(IninitialAuth);
    useEffect(() => {
        if(Auth.token !==null) return;
        checkLogin().then((data)=>{
            console.log("then Context");
            console.log(data);
            setAuth(data);
        });
      }, [Auth]);

    const handlerAuth = (dataUserObj)=>{
        setAuth({...dataUserObj});
    }
    const data = {Auth,handlerAuth};
    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}  

export {AuthProvider};
export default AuthContext;