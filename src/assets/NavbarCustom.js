import React, { useContext } from 'react'
import AuthContext from '../context/auth-context'
import ThemeContext from '../context/theme-context';
import {Link} from 'react-router-dom';
export default function NavbarCustom() {
  const {Auth,handlerAuth} = useContext(AuthContext);
  const {theme,handlerTheme} = useContext(ThemeContext);

    return (
    <div className={`fixed-top navbar navbar-expand-lg ${Auth.theme || theme}-style-navbar`}>
        <div className="container-md">
            <Link className="navbar-brand" to={'/'}>
    <img src="/logo32.png" width="30" height="30" className="d-inline-block align-top" alt=""/>
    Mr Delivery
  </Link>
        </div>
    </div>
  )
}
