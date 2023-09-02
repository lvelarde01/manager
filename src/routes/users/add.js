import React,{useState,useContext} from 'react';
import { Outlet, NavLink,Link,  useLoaderData, Form,redirect,useNavigation,useSubmit,useNavigate} from "react-router-dom";
import { useEffect } from "react";
import { useOutletContext} from 'react-router-dom'
import AuthContext from '../../context/auth-context';
import AlertMessage from '../../assets/alertmessage';
import ImageProfile from './imageprofile';
import InputCustom from '../../assets/inputCustom';
import SelectCustom from '../../assets/selectCustom';
import { newUser,startUp } from '../../requests/users';
import { schema } from '../../requests/schema/users';

export async function loader({ request }) {
  console.log("Add");
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  //const contacts = await getContacts(q);
    return {q};
  }
  
export async function action({ request, params }) {
  //let formData = await request.formData();
    //console.log(formData);
    //return redirect(`/users/add`);
  }



export default function Add() {
//const [count, setCount] = useOutletContext();

 // const contact = useLoaderData();
 const handleSubmit = async (event) =>{
  event.preventDefault();
  setLoading(true);
  setFetchReady({ready:false,msgtype:'success',message:'default'});
  const formData = new FormData(event.currentTarget);
  const defaultVarsInit = {token:'',theme:'blue',photo:'',saveConfigBrowser:false};
  const data = Object.fromEntries(formData);
  const {error,dataUserObj} = await startUp({data,schema,allowFields:["username","password","repeatpassword","email","role"]});

  console.log(data);
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

}
 const {Auth,handlerAuth} = useContext(AuthContext);
 const [loading,setLoading] = useState(false);
 const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
 const [errors,setErrors] = useState({});

 const dataUserObj = useLoaderData();
 const navigate = useNavigate();

  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
    {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
    <div className='row ms-3 mt-3 block-radius-style'>
        <Form className='col-12 mt-3' method='post' onSubmit={handleSubmit}  >
          <fieldset>
          <div className="mb-3">
            <h2>REGISTRO DE USUARIO</h2>
          </div>
              <div className='row'>
                    <legend>DETALLES DE USUARIO</legend>
                        <InputCustom  placeholderField={'USUARIO'} nameField={'username'} valueField={dataUserObj?.username} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'CONTRASENA'} typeField={"password"} nameField={'password'} valueField={dataUserObj?.password} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'REPETIR CONTRASENA'} typeField={"password"} nameField={'repeatpassword'} valueField={dataUserObj?.repeatpassword} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <SelectCustom placeholderField='ROL DE USUARIO' nameField={'rol'} valueField={dataUserObj?.rol} optionsField={{admin:'Admin',moderador:'Moderador',teacher:'Teacher',admon:'Administrativo'}} parentClassname={'col-12 mb-3'} />
                    <legend>DETALLES  PERSONALES</legend>
                        <InputCustom  placeholderField={'NOMBRES'} nameField={'firstname'} valueField={dataUserObj?.firstname} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'APELLIDOS'} nameField={'lastname'} valueField={dataUserObj?.lastname} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'RIF'} nameField={'ssid'} valueField={dataUserObj?.ssid} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'TELEFONO'}  nameField={'phone'} valueField={dataUserObj?.phone} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'EMAIL'} typeField={"email"} nameField={'email'} valueField={dataUserObj?.email} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
              </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Actualizando</span></>  : <><i className="fas fa-floppy-disk me-2"></i>Guardar</> }
              </button>
              <button type="button" onClick={()=>{navigate('/')}} className="btn btn-primary float-end"><i className='fas fa-arrow-rotate-left me-2'></i>Regresar</button>
            </div>
          </fieldset>
        </Form>
</div>
</div>
  )
}
