import React,{useContext} from 'react'
import {Link} from 'react-router-dom';
import AuthContext from '../context/auth-context'

export default function FooterCustom() {
    const {Auth,handlerAuth} = useContext(AuthContext);
  return (
    <footer
    className={`fixed-bottom ${Auth.theme || 'green'}-style-footer d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5`}>
    
    <div className="text-white mb-3 mb-md-0">
      Copyright © 2022. Todos los derechos reservado.
    </div>

    <div>
      <Link to={"/"} className="text-white me-4 rounded-circle">
        <i className="fab fa-facebook-f"></i>
      </Link>
      <Link to={"/"} className="text-white me-4 rounded-circle">
        <i className="fab fa-twitter"></i>
      </Link>
      <Link to={"/"} className="text-white me-4 rounded-circle">
        <i className="fab fa-google"></i>
      </Link>
      <Link to={"/"} className="text-white rounded-circle">
        <i className="fab fa-linkedin-in"></i>
      </Link>
    </div>

  </footer>
  )
}
