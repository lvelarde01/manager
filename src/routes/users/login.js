import React, { useContext, useEffect,useState,submitForm } from 'react'
import {Link,Form,redirect,useActionData,useNavigate} from 'react-router-dom';
import { getlogin,validateLogin,checkLogin } from '../../requests/users';
import AuthContext from "../../context/auth-context"

export async function loader({ request}) {

}

export default function Login() {
  let error = useActionData();
  const {Auth,handlerAuth} = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors,setErrors] = useState(null);
  const [loading,setLoading] = useState(false);
  const [showPW,setShowPW] = useState(false);

  const handlerShowPW = ()=>{
    setShowPW(!showPW);
  }
  
  const handlerUserChange = (event) =>{
    setUsername(event.target.value);
  }
  const handlerPassChange = (event) =>{
    setPassword(event.target.value);
  }
  useEffect(()=>{
    if(!error){
      setErrors(null);
    }
    if(handleCheckSubmit()){
      setIsDisabled(false);
    }else{
      setIsDisabled(true);
    }
    
  },[username,password]);

  const handleCheckSubmit = ()=>{
    return (username.length > 5 && password.length > 5);
  }
  async function handleSubmit(event){
    event.preventDefault();
    setLoading(true);
    if (!handleCheckSubmit()) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      return;
    }
    const result =  await getlogin({username,password});
    if(!result.validate){
     
      setTimeout(() => {
        setLoading(false);
        setErrors(result);
      }, 3000);
      return ;
  }
  const query = await handlerAuth(result);
    setIsDisabled(true);
    navigate('/');

    // actual submit logic...
  };
  

  return (
    <div className={`vw-100 ${Auth.theme || "green" }-style-login`}>
  <div className="container-fluid h-custom ">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-9 col-lg-6 col-xl-5">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          className="img-fluid" alt-text="Sample image"/>
      </div>
      <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <Form method='post' onSubmit={handleSubmit}>
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
            <input type="text" name='username' onChange={handlerUserChange}     required className={errors?.username ?`form-control form-control-lg border border-danger text-danger`:`form-control form-control-lg` }
              placeholder="Usuario" />
              {errors?.username && <p className='text-center text-danger mx-1 mt-1' >{errors.username}</p>}
          </div>

          
          <div className="form-outline input-group mb-3">
            <input type={showPW? 'text' : 'password'} name='password' onChange={handlerPassChange}  required className={errors?.password ?`form-control form-control-lg border border-danger text-danger`:`form-control form-control-lg` }
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
  <footer
    id='footer'
    className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5">
    
    <div className="text-white mb-3 mb-md-0">
      Copyright © 2022. Todos los derechos reservado.
    </div>

    <div>
      <Link to={"/"} className="text-white me-4 rounded-circle">
        <i className="fab fa-facebook-f"></i>
      </Link>
      <Link to={"/"} className="text-white me-4 rounded-circle">
        <i className="fab fa-twitter"></i>
      </Link>
      <Link to={"/"} className="text-white me-4 rounded-circle">
        <i className="fab fa-google"></i>
      </Link>
      <Link to={"/"} className="text-white rounded-circle">
        <i className="fab fa-linkedin-in"></i>
      </Link>
    </div>

  </footer>
</div>

  )
}
