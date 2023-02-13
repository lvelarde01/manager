import React, { useState,useContext, useEffect,useRef } from 'react'
import FooterCustom from '../assets/FooterCustom';
import NavbarCustom from '../assets/NavbarCustom';
import {Form,useNavigate,useLoaderData} from 'react-router-dom';
import AuthContext from '../context/auth-context';
import AlertMessage from '../assets/alertmessage';
import { startUp,schema_password,newPassword,checkTokenPassword } from '../requests/users';

export async function action({params}){
    
    return await checkTokenPassword({token:params.token});
   
}
export default function Password() {
  const navigate = useNavigate();
  const userInfo = useLoaderData();
  const {Auth,handlerAuth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});
  const [showPW,setShowPW] = useState(false);
  const TimerError = useRef(null);
  const [timerErrors,setTimererrors] = useState(false);
  const handlerOnchange = (event)=>{
    const nameField = event.target.name; 
    const {[nameField]:cpNameField,...cpErrors} = {...errors};
    if(cpNameField){ 
      setErrors({...cpErrors});
    }
  }
  const handlerShowPW = ()=>{
    setShowPW(!showPW);
  }
  const handlerOnSubmit = async (event)=>{
    event.preventDefault();
    setLoading(true);
    setFetchReady({ready:false,msgtype:'success',message:'default'});
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const {error,dataUserObj} = await startUp({data,schema:schema_password});
    if(Object.entries(error).length > 0){
        setTimeout(()=>{
          setFetchReady({ready:true,msgtype:'danger',message:''});
          setErrors({...error});
          setLoading(false);
        },3000);
        return;
    }
    console.log("NO ERRORS");
    const result = await newPassword({...dataUserObj});
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:''});
        setLoading(false);
      },3000);
    }
    console.warn({dataUserObj});
  }
  if(userInfo?.error){
    setTimeout(()=>{
      console.log("redirect");
      navigate('/login');
    },8000);
    return (
      <div className='container-fluid background-default'>
      <NavbarCustom />
        <div className={`row  justify-content-center ${Auth.theme || 'green'}-style mt-5   `} >
            <AlertMessage sizeClass={"col-10 mt-5"} message={userInfo?.error} msgtype={"danger"} typeAlert={"custom"} />
        </div>
      <FooterCustom />
      </div>
    );
  }
  return (
    <div className='container-fluid  background-default'>
      <NavbarCustom />
      <div className={`row  justify-content-center ${Auth.theme || 'green'}-style mt-5   `} >

      <Form method='post' className='col-8 mt-4 pt-4 p-4 block-radius-style' onSubmit={handlerOnSubmit}>
      <fieldset className='row'>
      {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }

      <div className="mb-3">
        <h2>RECUPERACION DE USUARIO</h2>
      </div>
      <legend>Informacion Usuario</legend>
       <div className="col-12 mb-3">
          <input  type={'text'} name='username' disabled={true} value={userInfo.username} className="form-control " placeholder="Usuario"/>
        </div>
        <div className="col-12 mb-3">
          <input  type={showPW? 'text' : 'password'} name='password' className="form-control " placeholder="Contrasena" required  onChange={handlerOnchange} />
          {errors?.password && <p className='text-center text-danger mx-1 mt-1' >*{errors.password}*</p>}
        </div>
        <div className=" col-12 mb-3">
          <input  type={showPW? 'text' : 'password'} name='repeatpassword' className="form-control " placeholder="Confirmar Contrasena" required onChange={handlerOnchange} />
          {errors?.repeatpassword && <p className='text-center text-danger mx-1 mt-1' >*{errors.repeatpassword}*</p>}
        </div>
        <div className="form-check mb-3">
              <input className="form-check-input me-2" type="checkbox" value="" onClick={handlerShowPW} />
              <label className="form-check-label" >
                Mostrar Contrasena
              </label>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>Guardar</> }
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
