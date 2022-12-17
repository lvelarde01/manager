import React, { useContext } from 'react'
import AuthContext from '../context/auth-context'
import {Link} from 'react-router-dom';
export default function NavbarCustom() {
  const {Auth,handlerAuth} = useContext(AuthContext);
    return (
    <div className={`fixed-top navbar navbar-expand-lg ${Auth.theme || 'green'}-style-navbar`}>
        <div className="container-md">
            <Link className="navbar-brand" to={'/'}>Manager 1.0</Link>
        </div>
    </div>
  )
}
