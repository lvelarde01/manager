import React, { useContext,useState,useEffect} from 'react'
import {Link,Form,useNavigate} from 'react-router-dom';
import { getlogin,getloginAuthGoogle,startUp,schema_login } from '../../requests/users';
import AlertMessage from '../../assets/alertmessage';
import AuthContext from "../../context/auth-context";
import ThemeContext from '../../context/theme-context';
import FooterCustom from '../../assets/FooterCustom';
import Recovery from './recovery';
import jwt_decode from 'jwt-decode';
import NavbarCustom from '../../assets/NavbarCustom';
export async function loader({ request}) {

}

export default function Login() {
  
  async function hanlderLogin(response){
      const result = await getloginAuthGoogle(response);
       await handlerAuth(result);
      navigate('/');
    
    console.log(response);
    let dataUserObj = jwt_decode(response.credential);
    console.log(dataUserObj);
  }
  
  useEffect(()=>{
    window.google.accounts.id.initialize({
      client_id:process.env.REACT_APP_GOOGLEAPI,
      callback: hanlderLogin,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('btnoAuth'),
      { type: "standard", theme: "filled_blue", size: "large", shape: "rectangular", logo_alignment: "right" },
    );
  },[]);


  const {Auth,handlerAuth} = useContext(AuthContext);
  const {theme,handlerTheme} = useContext(ThemeContext);

  const navigate = useNavigate();
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});
  const [loading,setLoading] = useState(false);
  const [showPW,setShowPW] = useState(false);

  const handlerShowPW = ()=>{
    setShowPW(!showPW);
  }
  
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
    const {error,dataUserObj} = await startUp({data,schema:schema_login});
    if(Object.entries(error).length > 0){
        setTimeout(()=>{
          setFetchReady({ready:true,msgtype:'danger',message:''});
          setErrors({...error});
          setLoading(false);
        },3000);
        return;
    }
    console.log("NO ERRORS");
    const result =  await getlogin({...dataUserObj});
    if(!result.validate){
      setTimeout(() => {
        setLoading(false);
        setFetchReady({ready:true,msgtype:'danger',message:''});
        setErrors(result);
      }, 3000);
      return ;
    }

    await handlerAuth(result);
    navigate('/');
  }
  const handlerGoogleAuth = ()=>{
    const btnGoogle= document.getElementById("button-label");
    btnGoogle.click();
  }

  return (
    <div className={`vw-100 ${Auth.theme || theme}-style-login background-default`}>
      <NavbarCustom />
      <Recovery />
  <div className="container-fluid h-custom ">
  
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-9 col-lg-6 col-xl-5">
        <img src={'/img/delivery3.png'} className="img-fluid" alt='Imagen Ilustrativa'/>
      </div>
      <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 block-radius-style p-5">
        {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <Form method='post' onSubmit={handlerOnSubmit}>
          <div className='mb-3' id='btnoAuth'  style={{paddingLeft:"25%",display:'none'}}></div>

          <div className='row'>
              <div className='col-12 mt-3 d-flex justify-content-center align-items-start'>
                  <button type='button' className='btn btn-primary w-100'><i className='fa-brands fa-apple me-2'></i>Apple</button>
              </div>
              <div className='col-12 mt-3 d-flex justify-content-center align-items-start'>
                <button type='button' onClick={handlerGoogleAuth} className='btn btn-primary w-100'><i className='fa-brands fa-google me-2'></i>Google</button>
              </div>
          </div>

          
          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Iniciar Sesion</p>
          </div>

          
          <div className="form-outline mb-4">
            <input type="text" name='username' onChange={handlerOnchange}     required className={errors?.username ?`form-control form-control-lg border border-danger text-danger`:`form-control form-control-lg` }
              placeholder="Usuario" />
              {errors?.username && <p className='text-center text-danger mx-1 mt-1' >{errors.username}</p>}
          </div>

          
          <div className="form-outline input-group mb-3">
            <input type={showPW? 'text' : 'password'} name='password' onChange={handlerOnchange}  required className={errors?.password ?`form-control form-control-lg border border-danger text-danger`:`form-control form-control-lg` }
              placeholder="Contrasena" />
              <i className="fas fa-eye" onClick={handlerShowPW}  style={{'marginLeft': "-40px",'paddingRight':"20px", 'cursor': "pointer",'zIndex':'100','marginTop':'auto',"marginBottom":'auto'}}></i>
          </div>
          {errors?.password && <span><p className='text-center text-danger mx-1' >{errors.password}</p></span>}

          <div className="d-flex justify-content-between align-items-center">
            
            <div className="form-check mb-0">
              <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
              <label className="form-check-label" >
                Recordar
              </label>
            </div>
            <Link to={"/"} data-bs-toggle='modal' data-bs-target='#recoveryModal' className="text-body">Olvido su contrasena?</Link>
          </div>

          <div className="text-center text-lg-start mt-4 pt-2">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} >
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Iniciando</span></>  : <><i className="fas fa-key me-2"></i>Iniciar</> }
            </button>
             <Link to={"/register"}
                className=" btn btn-primary btn-lg float-end"><i className="fas fa-user me-2"></i>Registar</Link>
                
          </div>
          
        </Form>
      </div>
    </div>
  </div>
<FooterCustom />
</div>

  )
}
