import React,{useContext} from 'react';
import ThemeContext from '../context/theme-context';
import AuthContext from '../context/auth-context';

export default function Home() {
const {theme,handlerTheme} = useContext(ThemeContext);
const {Auth,handlerAuth} = useContext(AuthContext);

  return (
    <div className='background-default'>
      <h1>HOME</h1>

    </div>
  )
}
