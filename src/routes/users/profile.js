import React,{useContext} from 'react';
import { Outlet, NavLink,Link,  useLoaderData,useActionData, Form,redirect,useNavigation,useSubmit} from "react-router-dom";
import ThemeContext from '../../context/theme-context';
import {getinfoUser,updateinfoUser} from '../../requests/users';
import AlertMessage from '../../assets/alertmessage';
export async function loader({ request }) {
    const dataUserObj = await getinfoUser();
    return {...dataUserObj};
  }
  
export async function action({ request, params }) {
  let formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const result = await updateinfoUser(updates);
  console.log("ACTION DATA");
    console.log(result);
    return result;
  }



export default function Profile() {
  const {theme,handlerTheme} = useContext(ThemeContext);

  const dataUserObj = useLoaderData();
  const resultAction = useActionData();
  console.log("Profile");
  console.log(dataUserObj);

  return (
    <div className={`row justify-content-center ${theme}`}>
        <AlertMessage Elementshow={resultAction?.acknowledged || false} />
    <Form className='col-11 mt-3' method='post' >
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
          <button type="submit" className="btn btn-primary">Actualizar</button>
          <button type="button" className="btn btn-primary float-end">Cancelar</button>

        </div>
      </fieldset>
    </Form>
    </div>
  )
}
