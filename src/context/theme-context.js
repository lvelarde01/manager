import React,{createContext,useState} from "react";

const ThemeContext = createContext();

export const themes = {
        red:{
            class:"red-style",
            title:"Tema Rojo"
        },
        green:{
            class:"green-style",
            title:"Tema Verde"
        },
        blue:{
            class:"blue-style",
            title:"Tema Azul"
        },
        black:{
            class:"black-style",
            title:"Tema Negro"
        },
        yellow:{
            class:"yellow-style",
            title:"Tema Amarillo"
        },
        purple:{
            class:"purple-style",
            title:"Tema Morado"
        },
    };
const IninitialTheme = "green-style";

const ThemeProvider = ({children}) =>{
    const [theme,setTheme] = useState(IninitialTheme);
    console.log();

    const handlerTheme = (e)=>{
        const valueInput =  e.target.value;
        console.log(e.target.value);
        if (valueInput !== theme && themes[valueInput] !== undefined) {
            setTheme(themes[valueInput].class);
        }

    }

    const data = {theme,handlerTheme};
    return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>;
}  

export {ThemeProvider};
export default ThemeContext;