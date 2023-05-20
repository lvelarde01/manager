import React,{useContext, useState} from 'react';
import {useLoaderData,useNavigate, Form} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {getinfoUser,updateinfoUser} from '../../requests/users';
import AlertMessage from '../../assets/alertmessage';
import ImageProfile from './imageprofile';
import InputCustom from '../../assets/inputCustom';
import SelectCustom from '../../assets/selectCustom';
export async function loader({ request }) {
    const dataUserObj = await getinfoUser();
    return {...dataUserObj};
  }
  
export async function action({ request, params }) {
  }



export default function Profile() {
  const {Auth,handlerAuth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});


  const dataUserObj = useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (event) =>{
    event.preventDefault();
    setLoading(true);
    setFetchReady({ready:false,msgtype:'success',message:'default'});
    const formData = new FormData(event.currentTarget);
    const updates = Object.fromEntries(formData);
    const result = await updateinfoUser(updates);
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:''});
        setLoading(false);
      },3000);
    }
  }
  console.log({Auth});
if(Auth.role==='rider'){
  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
            <Form className='col-9 mt-3' method='post' onSubmit={handleSubmit}  >
              <fieldset>
              <div className="mb-3">
                <h2>PERFIL DE USUARIO</h2>
              </div>
              <div className='row'>
                          <legend>DETALLE DEL CONDUCTOR</legend>
                          <InputCustom  placeholderField={'Usuario'} nameField={'username'} valueField={dataUserObj?.username} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          <InputCustom  placeholderField={'NOMBRES'} nameField={'firstname'} valueField={dataUserObj?.firstname} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          <InputCustom  placeholderField={'APELLIDOS'} nameField={'lastname'} valueField={dataUserObj?.lastname} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          <InputCustom  placeholderField={'DNI O NIE'} nameField={'ssid'} valueField = {dataUserObj?.ssid} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          <InputCustom  placeholderField={'TELEFONO'} min={9} max={9} nameField={'phone'} valueField = {dataUserObj?.phone} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          <InputCustom  placeholderField={'EMAIL'} nameField={'email'} valueField={dataUserObj?.email} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          <InputCustom  placeholderField={'PERMISO DE CONDUCIR'} min={9} max={9} nameField={'drive_license'} valueField = {dataUserObj?.drive_license} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          <SelectCustom placeholderField='TIPO DE VEHICULO' nameField={'type_vehicle'} valueField = {dataUserObj?.type_vehicle} optionsField={["MOTO","COCHE","BICICLETA"]} />
                          <InputCustom  placeholderField={'MATRICULA'} min={9} max={9} nameField={'registration_vehicle'} valueField = {dataUserObj?.registration_vehicle} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Actualizando</span></>  : <><i className="fas fa-floppy-disk me-2"></i>Guardar</> }
                  </button>
                  <button type="button" onClick={()=>{navigate('/')}} className="btn btn-primary float-end"><i className='fas fa-arrow-rotate-left me-2'></i>Regresar</button>
                </div>
              </fieldset>
            </Form>
            <ImageProfile FetchReady={setFetchReady} />
    </div>
    </div>
  );
}
if(Auth.role==='comerce'){
  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
            <Form className='col-9 mt-3' method='post' onSubmit={handleSubmit}  >
              <fieldset>
              <div className="mb-3">
                <h2>PERFIL DE USUARIO</h2>
              </div>
              <div className='row'>
                        <legend>DETALLE DE EMPRESA</legend>
                        <InputCustom  placeholderField={'Usuario'} nameField={'username'} valueField={dataUserObj?.username} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'NOMBRES'} nameField={'firstname'} valueField={dataUserObj?.firstname} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'APELLIDOS'} nameField={'lastname'} valueField={dataUserObj?.lastname} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />

                        <InputCustom  placeholderField={'CIF O NIF'} nameField={'company_ssid'} valueField={dataUserObj?.company_ssid} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'NOMBRE O RAZON SOCIAL'} nameField={'company'} valueField={dataUserObj?.company} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'TELEFONO'} min={9} max={9} nameField={'phone'} valueField={dataUserObj?.phone} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'EMAIL'} min={9} max={9} nameField={'email'} valueField={dataUserObj?.email} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <SelectCustom placeholderField='LOCALIDAD' nameField={'location'} valueField={dataUserObj?.location} optionsField={["SAN CRISTOBAL DE LA LAGUNA"]} parentClassname={'col-6 mb-3'} />
                        <InputCustom  placeholderField={'CODIGO POSTAL'} nameField={'zipcode'} valueField={dataUserObj?.zipcode} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'DIRECCION'} nameField={'address'} valueField={dataUserObj?.address} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Actualizando</span></>  : <><i className="fas fa-floppy-disk me-2"></i>Guardar</> }
                  </button>
                  <button type="button" onClick={()=>{navigate('/')}} className="btn btn-primary float-end"><i className='fas fa-arrow-rotate-left me-2'></i>Regresar</button>
                </div>
              </fieldset>
            </Form>
            <ImageProfile FetchReady={setFetchReady} />
    </div>
    </div>
  );

}
if(Auth.role==='client'){
  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
            <Form className='col-9 mt-3' method='post' onSubmit={handleSubmit}  >
              <fieldset>
              <div className="mb-3">
                <h2>PERFIL DE USUARIO</h2>
              </div>
              <div className='row'>
                        <legend>DETALLE DE CLIENTE</legend>
                        <InputCustom  placeholderField={'Usuario'} nameField={'username'} valueField={dataUserObj?.username} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'NOMBRES'} nameField={'firstname'} valueField={dataUserObj?.firstname} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'APELLIDOS'} nameField={'lastname'} valueField={dataUserObj?.lastname} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'DIRECCION'} nameField={'address'} valueField={dataUserObj?.address} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'CODIGO POSTAL'} nameField={'zipcode'} valueField={dataUserObj?.zipcode} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Actualizando</span></>  : <><i className="fas fa-floppy-disk me-2"></i>Guardar</> }
                  </button>
                  <button type="button" onClick={()=>{navigate('/')}} className="btn btn-primary float-end"><i className='fas fa-arrow-rotate-left me-2'></i>Regresar</button>
                </div>
              </fieldset>
            </Form>
            <ImageProfile FetchReady={setFetchReady} />
    </div>
    </div>
  );

}

  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
            <Form className='col-9 mt-3' method='post' onSubmit={handleSubmit}  >
              <fieldset>
              <div className="mb-3">
                <h2>PERFIL DE USUARIO</h2>
              </div>
                <legend>Informacion de Usuario</legend>
                <div className="mb-3">
                  <input type="text" name='username' className="form-control " placeholder="Nombre de Usuario" defaultValue={dataUserObj?.username}/>
                </div>
                <div className="mb-3">
                  <input type="text" name='company' className="form-control " placeholder="Nombre de Empresa" defaultValue={dataUserObj?.company}/>
                </div>
                <div className="mb-3">
                  <input type="text" name='company_ssid' className="form-control " placeholder="Documento de la Empresa" defaultValue={dataUserObj?.company_ssid}/>
                </div>
                <div className="mb-3">
                  <select className="form-select" name='role' defaultValue={dataUserObj?.role} required>
                  <option value={null}>Seleccione rol de Usuario</option>
                    <option value={"admin"}>Administrador</option>
                    <option value={"moderator"}>Moderador</option>
                    <option value={"user"}>Usuario</option>
                  </select>
                </div>
                <legend>Informacion Personal</legend>
                <div className="mb-3">
                  <input type="text" name='firstname' className="form-control" defaultValue={dataUserObj?.firstname} placeholder="Nombre"/>
                </div>
                <div className="mb-3">
                  <input type="text" name='lastname' className="form-control " defaultValue={dataUserObj?.lastname}  placeholder="Apellido"/>
                </div>
                <div className="mb-3">
                  <input type="email" name='email' className="form-control " defaultValue={dataUserObj?.email} placeholder="Correo Electronico"/>
                </div>
                <div className="mb-3">
                  
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Actualizando</span></>  : <><i className="fas fa-floppy-disk me-2"></i>Guardar</> }
                  </button>
                  <button type="button" onClick={()=>{navigate('/')}} className="btn btn-primary float-end"><i className='fas fa-arrow-rotate-left me-2'></i>Regresar</button>

                </div>
              </fieldset>
            </Form>
            <ImageProfile FetchReady={setFetchReady} />
    </div>
    </div>
  )
}
