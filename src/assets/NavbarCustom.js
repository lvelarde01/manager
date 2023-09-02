import React, { useContext } from 'react'
import AuthContext from '../context/auth-context'
import ThemeContext from '../context/theme-context';
import {Link} from 'react-router-dom';
export default function NavbarCustom({children}) {
  const {Auth,handlerAuth} = useContext(AuthContext);
  const {theme,handlerTheme} = useContext(ThemeContext);

    return (
    <div className={`fixed-top navbar navbar-expand-lg ${Auth.theme || theme}-style-navbar`}>
        <div className="container-fluid">
            <Link className="navbar-brand" style={{marginLeft:"20px"}} to={'/'}>
            <img src="/logo.png" width="30" height="30" className="d-inline-block align-top me-2" alt=""/>
            School
          </Link>
          {children}
          <Link className="nav-link" to={'/login'}>
          <i className="fa-solid fa-right-to-bracket me-2"></i>Acceder
          </Link>
        </div>
    </div>
  )
}
