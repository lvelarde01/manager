import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import ThemeContext from '../context/theme-context';

export default function Menubar2({sidebarON}) {
  const {theme,handlerTheme} = useContext(ThemeContext);
  return (
    <nav className={`navbar ${theme}-navbar w-100`}>
            <div className="container-fluid ">
            <button type='botton' onClick={sidebarON}  className="btn btn-primary"><i className='fas fa-bars '></i></button>
            </div>
      </nav>
  )
}
