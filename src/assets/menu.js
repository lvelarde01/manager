import React from 'react';
import {Link,NavLink} from 'react-router-dom';

const customStyle = {
 
}
const customStyleimg ={
  width:"32px",
  height:"32px"
}
const styleMain = {
    "display": "flex",
    "flex-wrap": "nowrap",
    "height": "100vh",
    "height": "-webkit-fill-available",
    "max-height": "100vh",
    "overflow-x": "auto",
    "overflow-y": "hidden",
}

const menu = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={customStyle} id="menu">
    <Link href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">LOGO</span>
    </Link>
    <hr className="dropdown-divider"></hr>
    <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
        <NavLink
                    to={`/`}
                    className={
                      ({ isActive, isPending }) =>
                      isActive
                        ? "nav-link text-white active"
                        : isPending
                        ? "nav-link text-white pending"
                        : "nav-link text-white"
                    }
                  >
                    <i class="fas fa-home fa-fw me-3"></i>
            Inicio
        </NavLink>
        </li>
        <li>
          <Link to={"/"} className="nav-link text-white">
          <i class="fas fa-box fa-fw me-3"></i>
            Productos
          </Link>
        </li>
        
        <li>
          <Link to={"/"} className="nav-link text-white">
          <i class="fas fa-user-tie fa-fw me-3"></i>
            Proveedores
          </Link>
        </li>
        <li>
          <Link to={"/"} className="nav-link text-white">
          <i class="fas fa-users fa-fw me-3"></i>
            Usuarios
          </Link>
        </li>
        <li>
          <Link to={"/"} className="nav-link text-white">
          <i class="fas fa-database fa-fw me-3"></i>
            Migrador
          </Link>
        </li>
    </ul>
        <div className="dropdown">
        <hr className="dropdown-divider"></hr>
            
          <Link to={"/"} className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://github.com/mdo.png"  className="rounded-circle me-2" alt='' style={customStyleimg}>
          </img>
            <strong>mdo</strong>
          </Link>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
            <li><Link className="dropdown-item" to={"/"}>New project...</Link></li>
            <li><Link className="dropdown-item" to={"/"}>Settings</Link></li>
            <li><Link className="dropdown-item" to={"/"}>Profile</Link></li>
            <li><div className="dropdown-divider"></div></li>
            <li><Link className="dropdown-item" to={"/"}>Sign out</Link></li>
          </ul>
        </div>            
    </div>
  )
}

export default menu
