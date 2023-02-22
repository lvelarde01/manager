import React,{useContext,useState} from 'react'
import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp} from '../../requests/users';
import { schema_newuser,defaultVarsInit } from '../../requests/rules';
import {ActionFetch} from '../../requests/container';
import AlertMessage from '../../assets/alertmessage';


export async function loader({ request }) {
    console.log("Add");
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    //const contacts = await getContacts(q);
        return {q};
}
    
export function Add() {
  const {Auth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});

  const dataUserObj = useLoaderData();
  const navigate = useNavigate();

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
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    
    const {error,dataUserObj} = await startUp({data,schema:schema_newuser});
    if(Object.entries(error).length > 0){
        setTimeout(()=>{
          setFetchReady({ready:true,msgtype:'danger',message:''});
          setErrors({...error});
          setLoading(false);
        },3000);
        return;
    }
    console.log("NO ERRORS");
    const result = await ActionFetch({...dataUserObj,...defaultVarsInit},'/api/users/add');
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se guardo correctamente.'});
        setLoading(false);
        event.target.name.value = '';
      },3000);
    }else{
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'danger',message:'Se presento un problema, Por favor, verifique e intente de nuevo.'});
        setLoading(false);
        setErrors({...result});
      },3000);
    }
  }





  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
        <Form className='col-12 mt-3' method='post' onSubmit={handlerOnSubmit} >
      <fieldset>
      <div className="mb-3">
        <h2>REGISTRO DE USUARIO</h2>
      </div>
        <legend>Informacion de Usuario</legend>
        <div className="mb-3">
          <input type="text" name='username' className="form-control " onChange={handlerOnchange} placeholder="Nombre de Usuario"/>
          {errors?.username && <p className='text-center text-danger mx-1 mt-1' >*{errors.username}*</p>}
        </div>
        <div className="mb-3">
          <input type="password" name='password' className="form-control " onChange={handlerOnchange} placeholder="Contrasena"/>
          {errors?.password && <p className='text-center text-danger mx-1 mt-1' >*{errors.password}*</p>}
        </div>
        <div className="mb-3">
          <input type="password" name='repeatpassword' className="form-control " onChange={handlerOnchange} placeholder="Confirmar Contrasena"/>
          {errors?.repeatpassword && <p className='text-center text-danger mx-1 mt-1' >*{errors.repeatpassword}*</p>}
        </div>
        <div className="mb-3">
          <select className="form-select" name='role' required onChange={handlerOnchange} >
          <option value={null}>Seleccione rol de Usuario</option>
            <option value={"admin"}>Administrador</option>
            <option value={"moderator"}>Moderador</option>
            <option value={"user"}>Usuario</option>
          </select>
          {errors?.role && <p className='text-center text-danger mx-1 mt-1' >*{errors.role}*</p>}
        </div>
        <legend>Informacion Personal</legend>
        <div className="mb-3">
          <input type="text" name='firstname' className="form-control " onChange={handlerOnchange} placeholder="Apellido"/>
          {errors?.firstname && <p className='text-center text-danger mx-1 mt-1' >*{errors.firstname}*</p>}
        </div>
        <div className="mb-3">
          <input type="text" name='lastname' className="form-control " onChange={handlerOnchange} placeholder="Nombre"/>
          {errors?.lastname && <p className='text-center text-danger mx-1 mt-1' >*{errors.lastname}*</p>}
        </div>
        <div className="mb-3">
          <input type="email" name='email' className="form-control " onChange={handlerOnchange} placeholder="Correo Electronico"/>
          {errors?.email && <p className='text-center text-danger mx-1 mt-1' >*{errors.email}*</p>}
        </div>
        <div className="mb-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>Registrar</> }
            </button>
          <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/warehouse/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>Cancelar</button>

        </div>
      </fieldset>
    </Form>
    </div>
    </div>
  )
}