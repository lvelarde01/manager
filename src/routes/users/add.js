import React from 'react';
import { Outlet, NavLink,Link,  useLoaderData, Form,redirect,useNavigation,useSubmit} from "react-router-dom";
import { useEffect } from "react";
import { useOutletContext} from 'react-router-dom'

export async function loader({ request }) {
  console.log("Add");
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  //const contacts = await getContacts(q);
    return {q};
  }
  
export async function action({ request, params }) {
  let formData = await request.formData();
    console.log(formData);
    return redirect(`/users/add`);
  }



export default function Add() {
const [count, setCount] = useOutletContext();

  const contact = useLoaderData();

  return (
    <div className="row justify-content-center green-style ">
    <Form className='col-11 mt-3' method='post' >
      <fieldset>
      <div className="mb-3">
        <h2>REGISTRO DE USUARIO {count}</h2>
      </div>
        <legend>Informacion de Usuario</legend>
        <div className="mb-3">
          <input type="text" name='username' className="form-control " placeholder="Nombre de Usuario"/>
        </div>
        <div className="mb-3">
          <input type="password" name='password' className="form-control " placeholder="Contrasena"/>
        </div>
        <div className="mb-3">
          <input type="password" name='repeatpassword' className="form-control " placeholder="Confirmar Contrasena"/>
        </div>
        <div className="mb-3">
          <select className="form-select" name='role' required>
          <option value={null}>Seleccione rol de Usuario</option>
            <option value={"admin"}>Administrador</option>
            <option value={"moderator"}>Moderador</option>
            <option value={"user"}>Usuario</option>
          </select>
        </div>
        <legend>Informacion Personal</legend>
        <div className="mb-3">
          <input type="text" name='first' className="form-control " placeholder="Nombre"/>
        </div>
        <div className="mb-3">
          <input type="text" name='last' className="form-control " placeholder="Apellido"/>
        </div>
        <div className="mb-3">
          <input type="email" name='email' className="form-control " placeholder="Correo Electronico"/>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">Registrar</button>
          <button type="button" className="btn btn-primary float-end">Cancelar</button>

        </div>
      </fieldset>
    </Form>
    </div>
  )
}
