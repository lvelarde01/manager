import React, { useContext, useEffect } from 'react'
import {Link,Form,redirect,useActionData,useNavigate} from 'react-router-dom';
import { getlogin,validateLogin,checkLogin } from '../../requests/users';

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const validates = await validateLogin(updates);
  if(validates.validate){
    return validates;
  }
  const result =  await getlogin(updates);
    if(!result.validate){
    return result;
  }
  return redirect("/");
}
export async function loader({ request}) {
 }

export default function Login() {
  let error = useActionData();

  

  return (
    <div className="vw-100 green-style-login">
  <div className="container-fluid h-custom ">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-9 col-lg-6 col-xl-5">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          className="img-fluid" alt-text="Sample image"/>
      </div>
      <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <Form method='post'>
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
            <input type="text" name='username'  required className={error?.username ?`form-control form-control-lg border border-danger text-danger`:`form-control form-control-lg` }
              placeholder="Usuario" />
              {error?.username && <p className='text-center text-danger mx-1 mt-1' >{error.username}</p>}
          </div>

          
          <div className="form-outline mb-3">
            <input type="password" name='password' required className={error?.password ?`form-control form-control-lg border border-danger text-danger`:`form-control form-control-lg` }
              placeholder="Contrasena" />
              {error?.password && <p className='text-center text-danger mx-1 mt-1' >{error.password}</p>}
          </div>

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
            <button type="submit" className="btn btn-primary btn-lg"
              >Iniciar</button>
            <p className="small fw-bold mt-2 pt-1 mb-0">No tienes una Cuenta ? crear una cuenta <Link to={"/"}
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
