import React,{useContext} from 'react';
import ThemeContext from '../context/theme-context';

export default function Home() {
const {theme,handlerTheme} = useContext(ThemeContext);

  return (
    <div>
      <h1>INDEX PRINCIPAL{theme}</h1>
      <select className='form-select' onChange={handlerTheme}>
        <option value={"blue"}>Azul</option>
        <option value={"black"}>Azul</option>
        <option value={"green"}>Azul</option>

      </select>
      <button onClick={handlerTheme}>Click Change Name</button>
    </div>
  )
}
