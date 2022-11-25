import React, { useContext } from 'react'
import { Outlet, NavLink,Link,  useLoaderData, Form,redirect,useNavigation,useSubmit} from "react-router-dom";
import ThemeContext,{themes} from '../../context/theme-context';

export default function Configui() {
  const {theme,handlerTheme} = useContext(ThemeContext);
  console.log(Object.entries(themes))
  return (
    <div className={`row justify-content-center ${theme}`}>
    <Form className='col-11 mt-3' method='post' >
      <fieldset>
      <div className="mb-3">
        <h2>CONFIGURACION</h2>
      </div>
        <legend>Interfaz de Usuario</legend>
        <div className="mb-3">
          <select className="form-select" name='role' onChange={handlerTheme} required>
             {Object.entries(themes).map((item,index) => {return (<option key={index} value={item[0]}>{item[1].title}</option>)})}
          </select>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-primary float-end">Cancelar</button>
        </div>
      </fieldset>
    </Form>
    </div>
  )
}
