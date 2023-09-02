import React,{useState,useContext, useEffect} from 'react'
import {Link} from 'react-router-dom';
import Menulv2 from './menulv2';
import ThemeContext from '../context/theme-context';
import AuthContext from '../context/auth-context';
export async function loader(){

}

export default function Menu2({sidebar}) {
    const {theme,handlerTheme} = useContext(ThemeContext);
    const {Auth,handlerAuth} =  useContext(AuthContext);
    const [currentBtn,setcurrentBtn] = useState({});
    const [dataObj,setDataObj] = useState({});

    const moderator_options = {
      "dashboard":{show:false},
      "users":{show:false},
      "history_delivery":{show:false},
      "history_payment":{show:false},
      "login":{show:false},
    };
    const teacher_options = {
      "dashboard":{show:false},
      "users":{show:false},
      "history_delivery":{show:false},
      "history_payment":{show:false},
      "login":{show:false},
    };
    const admon_options = {
      "dashboard":{show:false},
      "users":{show:false},
      "history_delivery":{show:false},
      "history_payment":{show:false},
      "login":{show:false},
    };
    const admin_options = {
      "dashboard":{show:false},
      "users":{show:false},
      "history_delivery":{show:false},
      "history_payment":{show:false},
      "login":{show:false},
    };

    const moderator_options_patch = {
      "dashboard":{show:false,title:"Inicio",classicon:"fas fa-home fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "products":{show:false,title:"Productos",classicon:"fas fa-box fa-fw me-3",childrens:[{name:"Nuevo Producto",path:"/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Productos",path:"/products/add",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "users":{show:false,title:"Usuarios",classicon:"fas fa-users fa-fw me-3",childrens:[{name:"Registro",path:"/users/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Usuarios",path:"/users",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "history_delivery":{show:false,title:"Envios",classicon:"fas fa-user-tie fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "history_payment":{show:false,title:"Pagos",classicon:"fas fa-user-tie fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "login":{show:false,title:"Cuenta",classicon:"fas fa-key fa-fw me-3",childrens:[{name:"Perfil",path:"/profile",classicon:"fas fa-user fa-fw me-1"},{name:"Contraseña",path:"/users/password",classicon:"fas fa-unlock-keyhole fa-fw me-1"},{name:"Configuracion",path:"/users/config",classicon:"fas fa-gear fa-fw me-1"},{name:"Salir",path:"/logout",classicon:"fas fa-right-from-bracket fa-fw me-1 me-1"}]}
    };
    const teacher_options_patch = {
      "dashboard":{show:false,title:"Inicio",classicon:"fas fa-home fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "products":{show:false,title:"Productos",classicon:"fas fa-box fa-fw me-3",childrens:[{name:"Nuevo Producto",path:"/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Productos",path:"/products/add",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "users":{show:false,title:"Usuarios",classicon:"fas fa-users fa-fw me-3",childrens:[{name:"Registro",path:"/users/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Usuarios",path:"/users",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "history_delivery":{show:false,title:"Envios",classicon:"fas fa-user-tie fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "history_payment":{show:false,title:"Pagos",classicon:"fas fa-user-tie fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "login":{show:false,title:"Cuenta",classicon:"fas fa-key fa-fw me-3",childrens:[{name:"Perfil",path:"/profile",classicon:"fas fa-user fa-fw me-1"},{name:"Contraseña",path:"/users/password",classicon:"fas fa-unlock-keyhole fa-fw me-1"},{name:"Configuracion",path:"/users/config",classicon:"fas fa-gear fa-fw me-1"},{name:"Salir",path:"/logout",classicon:"fas fa-right-from-bracket fa-fw me-1 me-1"}]}
    };
    const admon_options_patch = {
      "dashboard":{show:false,title:"Inicio",classicon:"fas fa-home fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "products":{show:false,title:"Productos",classicon:"fas fa-box fa-fw me-3",childrens:[{name:"Nuevo Producto",path:"/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Productos",path:"/products/add",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "users":{show:false,title:"Usuarios",classicon:"fas fa-users fa-fw me-3",childrens:[{name:"Registro",path:"/users/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Usuarios",path:"/users",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "history_delivery":{show:false,title:"Envios",classicon:"fas fa-user-tie fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "history_payment":{show:false,title:"Pagos",classicon:"fas fa-user-tie fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "login":{show:false,title:"Cuenta",classicon:"fas fa-key fa-fw me-3",childrens:[{name:"Perfil",path:"/profile",classicon:"fas fa-user fa-fw me-1"},{name:"Contraseña",path:"/users/password",classicon:"fas fa-unlock-keyhole fa-fw me-1"},{name:"Configuracion",path:"/users/config",classicon:"fas fa-gear fa-fw me-1"},{name:"Salir",path:"/logout",classicon:"fas fa-right-from-bracket fa-fw me-1 me-1"}]}
    };
    const admin_options_patch = {
      "dashboard":{show:false,title:"Matricula",classicon:"fas fa-home fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "products":{show:false,title:"Horario",classicon:"fas fa-box fa-fw me-3",childrens:[{name:"Nuevo Producto",path:"/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Productos",path:"/products/add",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "users":{show:false,title:"Pagos",classicon:"fas fa-credit-card me-3",childrens:[{name:"Registro",path:"/users/add",classicon:"fas fa-plus fa-fw me-1"},{name:"Lista de Usuarios",path:"/users",classicon:"fas fa-list-alt fa-fw me-1"}]},
      "history_delivery":{show:false,title:"Notas",classicon:"fas fa-user-tie fa-fw me-3",childrens:[{name:"option1",path:"/",classicon:"fas fa-minus fa-fw me-1"},{name:"option2",path:"/",classicon:"fas fa-minus fa-fw me-1"}]},
      "history_payment":{show:false,title:"Usuarios",classicon:"fas fa-user-tie fa-fw me-3",childrens:[{name:"Lista de usuarios",path:"/users",classicon:"fas fa-list-alt fa-fw me-1"},{name:"Nuevo Usuario",path:"/users/add",classicon:"fas fa-plus fa-fw me-1"}]},
      "login":{show:false,title:"Cuenta",classicon:"fas fa-key fa-fw me-3",childrens:[{name:"Perfil",path:"/profile",classicon:"fas fa-user fa-fw me-1"},{name:"Contraseña",path:"/users/password",classicon:"fas fa-unlock-keyhole fa-fw me-1"},{name:"Configuracion",path:"/users/config",classicon:"fas fa-gear fa-fw me-1"},{name:"Salir",path:"/logout",classicon:"fas fa-right-from-bracket fa-fw me-1 me-1"}]}
    };

    useEffect(()=>{
      if(Object.keys(dataObj).length > 0)return;
         if(Auth.role ==="admin"){
            setDataObj({...admin_options_patch});
          }else if(Auth.role ==="moderator"){
            setDataObj({...moderator_options_patch});
          }else if(Auth.role ==="teacher"){
            setDataObj({...teacher_options_patch});
          }if(Auth.role ==="admon"){
            setDataObj({...admon_options_patch});
          }  
    },[Auth])
    useEffect(()=>{
      if(Auth.role === "moderator"){
        setcurrentBtn(moderator_options);
      }else if(Auth.role === "teacher"){
        setcurrentBtn(teacher_options);
      }else if(Auth.role === "admon"){
        setcurrentBtn(admon_options);
      }else if(Auth.role === "admin"){
        setcurrentBtn(admin_options);
      }

    },[setcurrentBtn,Auth])

    const handlerBtn = (event) =>{
      let stateObj = {...currentBtn};
      stateObj[event.target.id].show = !stateObj[event.target.id]?.show;
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
                      <i className={dataObj[item]?.classicon}></i>
                      {dataObj[item]?.title}
                  </button>
                  <Menulv2 dataObjChildren={dataObj[item]} ElementShow={currentBtn[item]?.show} handlerAuth={handlerAuth} />
                </li>
              )})
            }  
      <li className="border-top my-3"></li>
          <li className="mb-1" key={"login"}>
            <button className="btn btn-toggle align-items-center rounded collapsed text-white"   id={"login"} onClick={handlerBtn} >
                <i className={dataObj["login"]?.classicon}></i>
                {dataObj["login"]?.title}
            </button>
            <Menulv2 dataObjChildren={dataObj["login"]} ElementShow={currentBtn["login"]?.show}   />
          </li>
    </ul>
  </div>
  )
}
