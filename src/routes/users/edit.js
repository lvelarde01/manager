import React,{useState,useContext} from 'react';
import { Outlet, NavLink,Link,  useLoaderData, Form,redirect,useNavigation,useSubmit,useNavigate,useParams} from "react-router-dom";
import { useEffect } from "react";
import { useOutletContext} from 'react-router-dom'
import AuthContext from '../../context/auth-context';
import AlertMessage from '../../assets/alertmessage';
import ImageProfile from './imageprofile';
import InputCustom from '../../assets/inputCustom';
import SelectCustom from '../../assets/selectCustom';
import { newUser,startUp } from '../../requests/users';
import { schema } from '../../requests/schema/users';
import { ActionFetch } from '../../requests/utilsApis';

export async function loader({ request,params }) {
    const {id} = params;
    const data = await ActionFetch( {dataObj:{_id:id},UrlFetch:'/api/users/find'});
    return {...data};
  }
  
export async function action({ request, params }) {
  //let formData = await request.formData();
    //console.log(formData);
    //return redirect(`/users/add`);
  }



export function Edit() {
//const [count, setCount] = useOutletContext();

 const handleSubmit = async (event) =>{
  event.preventDefault();
  setLoading(true);
  setFetchReady({ready:false,msgtype:'success',message:'default'});
  const _id = event.currentTarget.id
  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries(formData);
  const {error,dataUserObj} = await startUp({data,schema,ignoreRules:{username:{rules:[{'isUnique':true}]},email:{rules:[{'isUnique':true}]}},allowFields:["username","firstname","lastname","ssid","phone","email","role"]});

  console.log({error});
  if(Object.entries(error).length > 0){
    setTimeout(()=>{
      setFetchReady({ready:true,msgtype:'danger',message:''});
      setErrors({...error});
      setLoading(false);
    },3000);
    return;
  }
  console.log("NO ERRORS");
  dataUserObj._id = _id;
  const result = await ActionFetch({dataObj:dataUserObj,UrlFetch:'/api/users/update'});

  const msgtype = result?.acknowledged ? 'success' : 'danger'; 
  setTimeout(()=>{
    setFetchReady({ready:true,msgtype:msgtype,message:''});
    setLoading(false);
  },3000);

}
 const {Auth,handlerAuth} = useContext(AuthContext);
 const [loading,setLoading] = useState(false);
 const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
 const [errors,setErrors] = useState({});

 const dataUserObj = useLoaderData();
 const navigate = useNavigate();
 console.log({dataUserObj});

  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
    {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
    <div className='row ms-3 mt-3 block-radius-style'>
        <Form className='col-12 mt-3' method='post' onSubmit={handleSubmit} id={dataUserObj?._id}  >
          <fieldset>
          <div className="mb-3">
            <h2>REGISTRO DE USUARIO</h2>
          </div>
              <div className='row'>
                    <legend>DETALLES DE USUARIO</legend>
                        <InputCustom  placeholderField={'USUARIO'} nameField={'username'} valueField={dataUserObj?.username} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <SelectCustom placeholderField='ROL DE USUARIO' nameField={'role'} valueField={dataUserObj?.rol} optionsField={{admin:'Admin',moderador:'Moderador',teacher:'Teacher',admon:'Administrativo'}} parentClassname={'col-12 mb-3'} />
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
              <button type="button" onClick={()=>{navigate('/users')}} className="btn btn-primary float-end"><i className='fas fa-arrow-rotate-left me-2'></i>Regresar</button>
            </div>
          </fieldset>
        </Form>
</div>
</div>
  )
}
