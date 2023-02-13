import React, { useContext,useState } from 'react'
import {Form,Link,useNavigate} from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import ThemeContext from '../../context/theme-context';
import {newUser,listRex,startUp,schema} from '../../requests/users';
import AlertMessage from '../../assets/alertmessage';
import FooterCustom from '../../assets/FooterCustom';
import NavbarCustom from '../../assets/NavbarCustom';
export async function action({request}){

}
export default function Register() {
  const navigate = useNavigate();
  const {Auth,handlerAuth} = useContext(AuthContext);
  const {theme,handlerTheme} = useContext(ThemeContext);

  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});

  const handlerOnchange = (event)=>{
    const nameField = event.target.name; 
    const {[nameField]:cpNameField,...cpErrors} = {...errors};
    if(cpNameField){ 
      setErrors({...cpErrors});
    }
  }

  const handlerOnSubmit = async (event)=>{
    event.preventDefault();
    setLoading(true);
    setFetchReady({ready:false,msgtype:'success',message:'default'});
    const defaultVarsInit = {token:'',theme:'green',photo:'',saveConfigBrowser:false};
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const {error,dataUserObj} = await startUp({data,schema});
    if(Object.entries(error).length > 0){
        setTimeout(()=>{
          setFetchReady({ready:true,msgtype:'danger',message:''});
          setErrors({...error});
          setLoading(false);
        },3000);
        return;
    }
    console.log("NO ERRORS");
    const result = await newUser({...dataUserObj,...defaultVarsInit});
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:''});
        setLoading(false);
      },3000);
    }
    console.warn({dataUserObj});
  }
    


  return (
    <div className='container-fluid'>
    <NavbarCustom />
    
    <div className={`row  justify-content-center ${Auth.theme || theme}-style mt-5   `} style={{ "maxHeight":"640px",
  "overflowY": "scroll"}} >
    <div className='col-5 mt-4'>
      <img src='./img/form2.png' className='img-fluid rounded mx-auto '/>
    </div>
    <Form className='col-6 mt-4 pt-4' method='post' onSubmit={handlerOnSubmit}  >
      <fieldset className='row'>
      {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
      <div className="mb-3">
        <h2>REGISTRO DE USUARIO</h2>
      </div>
      <legend>Informacion Empresa</legend>
        <div className="col mb-3">
          <input type="text" name='company_ssid' className="form-control " placeholder="RIF" required defaultValue={"sadasd"} onChange={handlerOnchange} />
          {errors?.company_ssid && <p className='text-center text-danger mx-1 mt-1' >*{errors.company_ssid}*</p>}
        </div>
        <div className="col mb-3">
          <input type="text" name='company' className="form-control " placeholder="Nombre de Empresa" required defaultValue={"sadasd"} onChange={handlerOnchange} />
          {errors?.company && <p className='text-center text-danger mx-1 mt-1' >*{errors.company}*</p>}
        </div>
        <legend>Informacion de Usuario</legend>
        <div className="mb-3">
          <input type="text" name='username' className="form-control " placeholder="Nombre de Usuario" required defaultValue={"lvelarde01"} onChange={handlerOnchange} />
          {errors?.username && <p className='text-center text-danger mx-1 mt-1' >*{errors.username}*</p>}
        </div>
        <div className="col mb-3">
          <input type="password" name='password' className="form-control " placeholder="Contrasena" required  defaultValue={"sadasd"} onChange={handlerOnchange} />
          {errors?.password && <p className='text-center text-danger mx-1 mt-1' >*{errors.password}*</p>}
        </div>
        <div className=" col mb-3">
          <input type="password" name='repeatpassword' className="form-control " placeholder="Confirmar Contrasena" required defaultValue={"sadasd"} onChange={handlerOnchange} />
          {errors?.repeatpassword && <p className='text-center text-danger mx-1 mt-1' >*{errors.repeatpassword}*</p>}
        </div>
        <div className="mb-3">
          <select className="form-select" name='role' required onChange={handlerOnchange}>
          <option value={null}>Seleccione rol de Usuario</option>
            <option value={"admin"}>Administrador</option>
            <option value={"moderator"}>Moderador</option>
            <option value={"user"}>Usuario</option>
          </select>
          {errors?.role && <p className='text-center text-danger mx-1 mt-1' >*{errors.role}*</p>}
        </div>
        <legend>Informacion Personal</legend>
        <div className="col mb-3">
          <input type="text" name='firstname' className="form-control " placeholder="Nombre" required defaultValue={"sadasd"} onChange={handlerOnchange} />
          {errors?.firstname && <p className='text-center text-danger mx-1 mt-1' >*{errors.firstname}*</p>}
        </div>
        <div className="col mb-3">
          <input type="text" name='lastname' className="form-control " placeholder="Apellido" required defaultValue={"sadasd"} onChange={handlerOnchange} />
          {errors?.lastname && <p className='text-center text-danger mx-1 mt-1' >*{errors.lastname}*</p>}
        </div>
        <div className="mb-3">
          <input type="email" name='email' className="form-control " placeholder="Correo Electronico" required defaultValue={"velardeluisangel@gmail.com"} onChange={handlerOnchange} />
          {errors?.email &&<p className='text-center text-danger mx-1 mt-1' >*{errors.email}*</p>}
        </div>
       
        
        <div className="mb-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>Registrar</> }
            </button>
          <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/login')}} ><i className='fas fa-arrow-rotate-left me-2'></i>Cancelar</button>

        </div>
      </fieldset>
    </Form>
    </div>
    <FooterCustom />    
    </div>
  )
}
