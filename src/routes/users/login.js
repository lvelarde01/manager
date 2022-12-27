import React, { useContext,useState} from 'react'
import {Link,Form,useNavigate} from 'react-router-dom';
import { getlogin,startUp,schema_login } from '../../requests/users';
import AlertMessage from '../../assets/alertmessage';
import AuthContext from "../../context/auth-context";
import FooterCustom from '../../assets/FooterCustom';

export async function loader({ request}) {

}

export default function Login() {
  const {Auth,handlerAuth} = useContext(AuthContext);
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
  

  return (
    <div className={`vw-100 ${Auth.theme || "green" }-style-login`}>
  <div className="container-fluid h-custom ">

    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-9 col-lg-6 col-xl-5">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          className="img-fluid" alt='Imagen Ilustrativa'/>
      </div>
      <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
        <Form method='post' onSubmit={handlerOnSubmit}>
          <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
            <p className="lead fw-normal mb-0 me-3">Acceder con </p>
            <button type="button" className="btn btn-primary btn-floating rounded-circle mx-1">
              <i className="fab fa-facebook-f"></i>
            </button>

            <button type="button" className="btn btn-primary btn-floating mx-1 rounded-circle ">
              <i className="fab fa-twitter"></i>
            </button>

            <button type="button" className="btn btn-primary btn-floating mx-1 rounded-circle">
              <i className="fab fa-linkedin-in"></i>
            </button>
          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">O</p>
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
            <Link to={"/"} className="text-body">Olvido su contrasena?</Link>
          </div>

          <div className="text-center text-lg-start mt-4 pt-2">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} >
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Iniciando</span></>  : <><i className="fas fa-key me-2"></i>Iniciar</> }
            </button>
            <p className="small fw-bold mt-2 pt-1 mb-0">No tienes una Cuenta ? crear una cuenta <Link to={"/register"}
                className="link-danger">Registar</Link></p>
          </div>

        </Form>
      </div>
    </div>
  </div>
<FooterCustom />
</div>

  )
}
