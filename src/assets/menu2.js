import React,{useState,useContext} from 'react'
import {Link} from 'react-router-dom';
import Menulv2 from './menulv2';
import ThemeContext from '../context/theme-context';
import AuthContext from '../context/auth-context';
export async function loader(){

}

export default function Menu2({sidebar}) {
    const {theme,handlerTheme} = useContext(ThemeContext);
    const {Auth,handlerAuth} =  useContext(AuthContext);
    const [currentBtn,setcurrentBtn] = useState({
      "dashboard":{show:false},
      "products":{show:false},
      "users":{show:false},
      "providers":{show:false},
      "migrate":{show:false},
      "login":{show:false},
    });
    const dataObj = {
      "dashboard":{show:false,title:"Inicio",classicon:"fas fa-home fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "products":{show:false,title:"Productos",classicon:"fas fa-box fa-fw me-3",childrens:[{name:"Nuevo Producto",path:"/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Productos",path:"/products/add",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "users":{show:false,title:"Usuarios",classicon:"fas fa-users fa-fw me-3",childrens:[{name:"Registro",path:"/users/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Usuarios",path:"/users",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "providers":{show:false,title:"Proveedor",classicon:"fas fa-user-tie fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "migrate":{show:false,title:"Migrador",classicon:"fas fa-database fa-fw me-3",childrens:[{name:"Nueva Carga",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"Historial de Carga",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "login":{show:false,title:"Cuenta",classicon:"fas fa-key fa-fw me-3",childrens:[{name:"Perfil",path:"/profile",classicon:"fas fa-user fa-fw me-1"},{name:"Configuracion",path:"/users/config",classicon:"fas fa-gear fa-fw me-1"},{name:"Salir",path:"/logout",classicon:"fas fa-right-from-bracket fa-fw me-1 me-1"}]}
      
    };
    const handlerBtn = (event) =>{
      let stateObj = {...currentBtn};
      stateObj[event.target.id].show = !stateObj[event.target.id].show;
      setcurrentBtn(stateObj);
    }

    


    return (
    <div className={`flex-shrink-0 p-3  ${Auth.theme}-style-sidebar ${sidebar}`}>
    <Link to="/" className="d-flex align-items-center pb-3 mb-3 text-decoration-none border-bottom">
      <span className="fs-5 fw-semibold text-white mx-auto ">MENU</span>
    </Link>
    <ul className="list-unstyled ps-0">
            { 
              Object.keys(dataObj).map((item, i) => {
                if(item ==="login") return;
                return (
                 <li className="mb-1" key={item}>
                  <button className="btn btn-toggle align-items-center rounded collapsed text-white"   id={item} onClick={handlerBtn} >
                      <i className={dataObj[item].classicon}></i>
                      {dataObj[item].title}
                  </button>
                  <Menulv2 dataObjChildren={dataObj[item]} ElementShow={currentBtn[item].show} handlerAuth={handlerAuth} />
                </li>
              )})
            }  
      <li className="border-top my-3"></li>
          <li className="mb-1" key={"login"}>
            <button className="btn btn-toggle align-items-center rounded collapsed text-white"   id={"login"} onClick={handlerBtn} >
                <i className={dataObj["login"].classicon}></i>
                {dataObj["login"].title}
            </button>
            <Menulv2 dataObjChildren={dataObj["login"]} ElementShow={currentBtn["login"].show}   />
          </li>
    </ul>
  </div>
  )
}
