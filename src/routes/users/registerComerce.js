import React, { useContext,useState } from 'react'
import {Form,Link,useNavigate} from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import ThemeContext from '../../context/theme-context';
import {newUser,listRex,startUp,schema} from '../../requests/users';
import AlertMessage from '../../assets/alertmessage';
import FooterCustom from '../../assets/FooterCustom';
import NavbarCustom from '../../assets/NavbarCustom';
import InputCustom from '../../assets/inputCustom';
import SelectCustom from '../../assets/selectCustom';
export async function action({request}){

}
export default function Register() {
  const navigate = useNavigate();
  const {Auth,handlerAuth} = useContext(AuthContext);
  const {theme,handlerTheme} = useContext(ThemeContext);

  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});
  const [stepView,setStepView] = useState({});

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
  <div className='container-fluid background-default overflow-auto'>
      <div className='row d-flex align-items-center justify-content-center vh-100 vw-100 '>
          <NavbarCustom />
          <div className={`col-10 ms-3 me-3 block-radius-style ${Auth.theme || theme}-style`}>
          
                    <Form className='ms-3 me-3 mt-4' method='post' onSubmit={handlerOnSubmit}  >
                      <fieldset>
                      {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} typeAlert={'custom'} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
                      <div className="mb-3">
                        <h2>REGISTRO COMERCIO</h2>
                      </div>
                      <legend>DETALLE DE EMPRESA</legend>
                        <InputCustom  placeholderField={'CIF O NIF'} nameField={'company_ssid'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'NOMBRE O RAZON SOCIAL'} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'TELEFONO'} min={9} max={9} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'EMAIL'} min={9} max={9} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <SelectCustom placeholderField='LOCALIDAD' optionsField={["SAN CRISTOBAL DE LA LAGUNA"]} />
                        <InputCustom  placeholderField={'DIRECCION'} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'CODIGO POSTAL'} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        
                        <div className='row mb-3 mt-3'>
                            <div className='col-2'>
                              <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-circle-left me-2'></i>Anterior</> }
                                </button>
                            </div>
                            <div className='col-8 pt-2'>
                              <div className="progress" style={{height:"20px"}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style={{width: "75%"}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"><strong>TOTAL COMPLETADO 25%</strong></div>
                              </div>
                            </div>
                            <div className='col-2'>
                                <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/login')}} >Siguiente<i className='fas fa-circle-right ms-2'></i></button>
                            </div>
                        </div>
                      </fieldset>
                    </Form>
                    
            </div>
            
          <FooterCustom />

      </div>
  </div>

);   


  return (
    <div className='container-fluid background-default overflow-auto'>
      <div className='row '>
          <NavbarCustom />
          
            <div className={`col ms-3 me-3 block-radius-style ${Auth.theme || theme}-style`} style={{marginTop:'60px',marginBottom:'100px'}}>
                    <Form className='ms-3 me-3 mt-4' method='post' onSubmit={handlerOnSubmit}  >
                      <fieldset>
                      {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} typeAlert={'custom'} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
                      <div className="mb-3">
                        <h2>REGISTRO DE USUARIO</h2>
                      </div>
                      <legend>Informacion Empresa</legend>
                      <div className='row'>
                        <InputCustom  placeholderField={'DOCUMENT N'} nameField={'company_ssid'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'NOMBRE DE LA EMPRESA'} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        </div>
                        <legend>Informacion de Usuario</legend>
                        <InputCustom  placeholderField={'USUARIO'} nameField={'username'} parentClassname={'mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'USUARIO'} nameField={'username'} parentClassname={'mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'USUARIO'} nameField={'username'} parentClassname={'mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'USUARIO'} nameField={'username'} parentClassname={'mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'USUARIO'} nameField={'username'} parentClassname={'mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'CONTRASENA'} typeField={"password"} nameField={'password'} parentClassname={'col'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'REPETIR CONTRASENA'} typeField={"password"} nameField={'repeatpassword'} parentClassname={'col'} errorsField={errors} setErrorField = {setErrors} />
                        <SelectCustom placeholderField='TIPO DE CUENTA' parentClassname={'mb-3'} optionsField={{comcerce:'COMERCIO',delivery:'REPARTIDOR',client:'CLIENTE'}} />
                        <legend>Informacion Personal</legend>
                        <InputCustom  placeholderField={'NOMBRE'} nameField={'firstname'} parentClassname={'col'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'APELLIDO'} nameField={'lastname'} parentClassname={'col'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'CORREO ELECTRONICO'} typeField={"email"} nameField={'email'} parentClassname={'mb-3'} errorsField={errors} setErrorField = {setErrors} />
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
    </div>
  )
}
