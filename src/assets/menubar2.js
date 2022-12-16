import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import ThemeContext from '../context/theme-context';
import AuthContext from '../context/auth-context';
export default function Menubar2({sidebarON}) {
  const {theme,handlerTheme} = useContext(ThemeContext);
  const {Auth,handlerAuth} = useContext(AuthContext);
  return (
    <nav className={`navbar ${Auth.theme}-style-navbar w-100`}>
            <div className="container-fluid ">
            <button type='botton' onClick={sidebarON}  className="btn btn-primary"><i className='fas fa-bars '></i></button>
            </div>
      </nav>
  )
}
