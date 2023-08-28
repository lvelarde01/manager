import React, { useContext,useState,useEffect,useRef,useCallback } from 'react'
import {Form,Link,useNavigate} from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import ThemeContext from '../../context/theme-context';
import {newUser,getloginAuthGoogle,startUp} from '../../requests/users';
import {schema} from '../../requests/schema/users';
import AlertMessage from '../../assets/alertmessage';
import FooterCustom from '../../assets/FooterCustom';
import NavbarCustom from '../../assets/NavbarCustom';
import InputCustom from '../../assets/inputCustom';
import SelectCustom from '../../assets/selectCustom';


import NewModal from '../../assets/newmodal';
export async function action({request}){

}
export default function Register() {
  const navigate = useNavigate();
  const {Auth,handlerAuth} = useContext(AuthContext);
  const {theme,handlerTheme} = useContext(ThemeContext);

  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});
  const [showRegister,setShowRegister] = useState(false);
  const currentModal = useRef(null);

  const hanlderLogin = useCallback(async(response)=>{
    const typeRegister = currentModal.current;
    const result = await getloginAuthGoogle({...response,typeLoggin:typeRegister});
      const dataLogin = await handlerAuth(result);
      let modalElement = document.getElementById(`${typeRegister}Modal`);
      let modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      console.log(result);
      navigate('/');
      
  },[currentModal,handlerAuth,navigate])

  useEffect(()=>{
    window.google.accounts.id.initialize({
      client_id:process.env.REACT_APP_GOOGLEAPI,
      callback: hanlderLogin,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('btnoAuth'),
      { type: "icon", theme: "filled_blue", size: "large", shape: "rectangular", width: "2048", logo_alignment: "right" },
    );
  },[hanlderLogin]);

  const handlerOnSubmit = async (event)=>{
    event.preventDefault();
    setLoading(true);
    setFetchReady({ready:false,msgtype:'success',message:'default'});
    const defaultVarsInit = {token:'',theme:'blue',photo:'',saveConfigBrowser:false};
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const {error,dataUserObj} = await startUp({data,schema,allowFields:["username","password","repeatpassword","email","role"]});
    console.log({data});
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
    const result = await newUser({...dataUserObj,...defaultVarsInit});
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:''});
        setLoading(false);
      },3000);
    }
    console.warn({dataUserObj});
  }
  const handlerClick =  useCallback((event)=>{
    currentModal.current=event.currentTarget.id;
  },[]);
  const handlerShwoRegister = (event)=>{
    setShowRegister(!showRegister);
  }
  const handlerGoogleAuth = ()=>{
    const btnGoogle= document.getElementById("button-label");
    btnGoogle.click();
  }
return (
  <>
    <div className='container-fluid background-default overflow-auto'>
      <div className='row d-flex align-items-center justify-content-center vh-100 vw-100 pt-5 '>
          <NavbarCustom />
          <div className={`col-10 ms-3 me-3 mt-3 pt-1 block-radius-style ${Auth.theme || theme}-style`}>
                      {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} typeAlert={'custom'} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
                      <div className="mb-3">
                        <h2>REGISTRO DE CUENTA</h2>
                      </div>
                      <div className='row'>
                      <div className='col-4' id='rider' data-bs-toggle="modal" data-bs-target="#riderModal"  onClick={handlerClick}>
                        <div className="card mb-3">
                        <img src="/img/rider.png" className="card-img-top" style={{maxHeight:'300px',minHeight:'300px'}} alt="..."></img>
                          <div className="card-body">
                            <h5 className="card-title">Rider</h5>
                            <p className="card-text">Unete a nuestra flora trabaja como repartidor y saca partido a tu tiempo, mientras ganas dinero, trabaja cuando quieras y como quieras con mr delivery.</p>
                            <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                          </div>
                        </div>
                      </div>
                      <div className='col-4' id='client' data-bs-toggle="modal" data-bs-target="#clientModal" onClick={handlerClick} >
                        <div className="card mb-3">
                        <img src="/img/client.png" className="card-img-top" style={{maxHeight:'300px',minHeight:'300px'}} alt="..."></img>
                          <div className="card-body">
                            <h5 className="card-title">Cliente</h5>
                            <p className="card-text">Encuentra los mejores establecimientos de tu zona descarga ya mr delivery, pide a tu establecimiento favorito te lo llevamos a casa o la zona donde te encuentres de la comarca nordeste (tegueste-tejina-valle de guerra-bajamar-punta del hidalgo).</p>
                            <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                          </div>
                        </div>
                      </div>
                      <div className='col-4' id='comerce' data-bs-toggle="modal" data-bs-target="#comerceModal" onClick={handlerClick} >
                        <div className="card mb-3">
                        <img src="/img/comerce.png" className="card-img-top" style={{maxHeight:'300px',minHeight:'300px'}} alt="..."></img>
                          <div className="card-body">
                            <h5 className="card-title">Comercio</h5>
                            <p className="card-text">Unete a nosotros y conecta con tus clientes de forma diferente con nuestra app, nosotros repartimos por ti, te hacemos el trabajo más fácil con nuestra plataforma de delivery a que esperas...</p>
                            <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                          </div>
                        </div>
                      </div>
                      </div>
          </div>
        </div>
      </div>
      <div id='btnoAuth'  style={{display:'none'}}></div>

      <NewModal title={'REGISTRO DE RIDER'} actionSubmit={showRegister} actionReset={showRegister} idModal="riderModal" msgtype={"form"} handlerActionSubmit={handlerOnSubmit} startModal={true} handlerActionReset={()=>console.log('work Reset')}>
                    <div className={`container-fluid ${Auth.theme || theme}-style`}>
                      <div className='row'>
                            <fieldset>
                                  {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} typeAlert={'custom'} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
                                <div className='row'>
                                    <legend>ACCEDE</legend>
                                    <div className='col d-flex justify-content-center align-items-start'>
                                        <button type='button' className='btn btn-primary'><i className='fa-brands fa-apple me-2'></i>Apple</button>
                                    </div>
                                    <div className='col d-flex justify-content-center align-items-start'>
                                      <button type='button' onClick={handlerGoogleAuth} className='btn btn-primary'><i className='fa-brands fa-google me-2'></i>Google</button>
                                    </div>
                                    <div className='col d-flex justify-content-center align-items-start'>
                                        <button type='button' onClick={handlerShwoRegister} className='btn btn-primary'><i className='fa fa-envelope me-2'></i>Correo</button>
                                    </div>
                                  </div>

                                  {showRegister &&(
                                    <>
                                      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-1 border-bottom"></div>
                                        <div className='row pt-3'>
                                          <legend>INFORMACION DE USUARIO</legend>
                                          <InputCustom  placeholderField={'USUARIO'} nameField={'username'} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                          <InputCustom  placeholderField={'CONTRASENA'} nameField={'password'} typeField='password' parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                          <InputCustom  placeholderField={'CONFIRMAR CONTRASENA'} typeField='password' nameField={'repeatpassword'} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                          <InputCustom  placeholderField={'CORREO ELECTRONICO'} typeField='email' nameField={'email'} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                          <InputCustom  placeholderField={''} typeField='hidden' nameField={'role'} valueField='rider' parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                        </div>
                                    </>
                                    )}
                            </fieldset>
                      </div>
                  </div>
      </NewModal>
      <NewModal title={'REGISTRO DE COMERCIO'} idModal="comerceModal" msgtype={"form"} actionSubmit={showRegister} actionReset={showRegister} handlerActionSubmit={handlerOnSubmit} startModal={true} handlerActionReset={()=>console.log('work Reset')}>
          <div className={`container-fluid ${Auth.theme || theme}-style`}>
                      <div className='row'>
                      <fieldset>
                      {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} typeAlert={'custom'} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
                          <div className='row'>
                              <legend>ACCEDE</legend>
                              <div className='col d-flex justify-content-center align-items-start'>
                                  <button type='button' className='btn btn-primary'><i className='fa-brands fa-apple me-2'></i>Apple</button>
                              </div>
                              <div className='col d-flex justify-content-center align-items-start'>
                                <button type='button' onClick={handlerGoogleAuth} className='btn btn-primary'><i className='fa-brands fa-google me-2'></i>Google</button>
                              </div>
                              <div className='col d-flex justify-content-center align-items-start'>
                                  <button type='button' onClick={handlerShwoRegister} className='btn btn-primary'><i className='fa fa-envelope me-2'></i>Correo</button>
                              </div>
                            </div>

                            {showRegister &&(
                              <>
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-1 border-bottom"></div>
                                  <div className='row pt-3'>
                                    <legend>INFORMACION DE USUARIO</legend>
                                    <InputCustom  placeholderField={'USUARIO'} nameField={'username'} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                    <InputCustom  placeholderField={'CONTRASENA'} nameField={'password'} typeField='password' parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                    <InputCustom  placeholderField={'CONFIRMAR CONTRASENA'} typeField='password' nameField={'repeatpassword'} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                    <InputCustom  placeholderField={'CORREO ELECTRONICO'} typeField='email' nameField={'email'} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                    <InputCustom  placeholderField={''} typeField='hidden' nameField={'role'} valueField='comerce' parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                  </div>
                              </>
                          )}
                      </fieldset>
                      </div>
                      </div>
      </NewModal>
      <NewModal title={'REGISTRO DE CLIENTE'} idModal="clientModal" msgtype={"form"} actionSubmit={showRegister} actionReset={showRegister} handlerActionSubmit={handlerOnSubmit} startModal={true} handlerActionReset={()=>console.log('work Reset')}>
      <div className={`container-fluid ${Auth.theme || theme}-style`}>
                  <div className='row'>
                  <fieldset>
                  {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} typeAlert={'custom'} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
                      <div className='row'>
                          <legend>ACCEDE</legend>
                          <div className='col d-flex justify-content-center align-items-start'>
                              <button type='button' className='btn btn-primary'><i className='fa-brands fa-apple me-2'></i>Apple</button>
                          </div>
                          <div className='col d-flex justify-content-center align-items-start'>
                            <button type='button' onClick={handlerGoogleAuth} className='btn btn-primary'><i className='fa-brands fa-google me-2'></i>Google</button>
                          </div>
                          <div className='col d-flex justify-content-center align-items-start'>
                              <button type='button' onClick={handlerShwoRegister} className='btn btn-primary'><i className='fa fa-envelope me-2'></i>Correo</button>
                          </div>
                        </div>

                        {showRegister &&(
                          <>
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-1 border-bottom"></div>
                              <div className='row pt-3'>
                                <legend>INFORMACION DE USUARIO</legend>
                                <InputCustom  placeholderField={'USUARIO'} nameField={'username'} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                <InputCustom  placeholderField={'CONTRASENA'} nameField={'password'} typeField='password' parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                <InputCustom  placeholderField={'CONFIRMAR CONTRASENA'} typeField='password' nameField={'repeatpassword'} parentClassname={'col-6 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                <InputCustom  placeholderField={'CORREO ELECTRONICO'} typeField='email' nameField={'email'} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                                <InputCustom  placeholderField={''} typeField='hidden' nameField={'role'} valueField='client' parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                              </div>
                          </>
                      )}
                  </fieldset>
                  </div>
                  </div>
      </NewModal>
  </>
);


return (
  <div className='container-fluid background-default overflow-auto'>
      <div className='row d-flex align-items-center justify-content-center vh-100 vw-100 '>
          <NavbarCustom />
          <div className={`col-10 ms-3 me-3 block-radius-style ${Auth.theme || theme}-style`}>
          
                    <Form className='ms-3 me-3 mt-4' method='post' onSubmit={handlerOnSubmit}  >
                      <fieldset>
                      {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} typeAlert={'custom'} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
                      <div className="mb-3">
                        <h2>REGISTRO DE CLIENTE</h2>
                      </div>
                      <legend>DETALLE DEL CLIENTE</legend>
                        <InputCustom  placeholderField={'NOMBRES Y APELLIDOS'} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'TELEFONO'} min={9} max={9} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <InputCustom  placeholderField={'EMAIL'} min={9} max={9} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        <SelectCustom placeholderField='TIPO DE VEHICULO' optionsField={["MOTO","COCHE","BICICLETA"]} />
                        <InputCustom  placeholderField={'MATRICULA'} min={9} max={9} nameField={'company'} parentClassname={'col mb-3'} errorsField={errors} setErrorField = {setErrors} />
                        
                        <div className='row mb-3 mt-3'>
                            <div className='col-2'>
                              <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-circle-left me-2'></i>Anterior</> }
                                </button>
                            </div>
                            <div className='col-8 pt-2'>

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
