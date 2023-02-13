import React, { useContext,useState } from 'react'
import { Outlet, NavLink,Link,  useLoaderData, Form,redirect,useNavigation,useSubmit} from "react-router-dom";
import ThemeContext,{themes} from '../../context/theme-context';
import AuthContext from '../../context/auth-context';
import {updateinfoUser} from '../../requests/users';
import AlertMessage from '../../assets/alertmessage';

export default function Configui() {
  const {theme,handlerTheme} = useContext(ThemeContext);
  const {Auth,handlerAuth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState(false);
  
  const handlerCheck = () =>{
    const dataAuth = {...Auth};
    dataAuth.saveConfigBrowser=!Auth.saveConfigBrowser;
      handlerAuth({...dataAuth});
    }

  const handlerAuthUpdate = (event)=>{
    const dataAuth = {...Auth};
    if(!dataAuth.themeBackup){
      dataAuth.themeBackup=dataAuth.theme;
    }
    dataAuth.theme = event.target.value; 
    handlerAuth({...dataAuth});
  }
  const handlerCancel = ()=>{
    const dataAuth = {...Auth};
    if(!dataAuth.themeBackup)return;
    dataAuth.theme = dataAuth.themeBackup; 
    handlerAuth({...dataAuth});
  }
  const handleSubmit = async (event)=>{
    event.preventDefault();
    setFetchReady(false);
    setLoading(true);
    const result = await updateinfoUser({theme:Auth.theme,saveConfigBrowser:Auth.saveConfigBrowser});
    if(result.acknowledged){
      setTimeout(()=> {
        setFetchReady(true);
        setLoading(false);
      } ,3000);
    }
  }
  return (
    <div className={`row justify-content-center ${Auth.theme}-style`}>
       {fetchReady && (<AlertMessage Elementshow={true} />) }
    <Form className='col-11 mt-3 p-4 block-radius-style' method='post' onSubmit={handleSubmit} >
      <fieldset>
      <div className="mb-3">
        <h2>CONFIGURACION</h2>
      </div>
        <legend>Interfaz de Usuario</legend>
        <div className="mb-3">
          <select className="form-select" name='theme' onChange={handlerAuthUpdate} defaultValue={Auth.theme} required>
             {Object.entries(themes).map((item,index) => {return (<option key={index} value={item[0]}>{item[1].title}</option>)})}
          </select>
        </div>
        <div className="mb-3 form-check">
          <input className="form-check-input" type="checkbox" defaultChecked={Auth.saveConfigBrowser} onChange={handlerCheck}/>
          <label className="form-check-label">
            Guardar configurarion en el computador
          </label>
        </div>
        <div className="mb-3">
          {loading ? <button type="button" disabled className="btn btn-primary"><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></button> : <button type="submit" className="btn btn-primary"><i className='fas fa-floppy-disk me-2'></i>Guardar</button> }
          {Auth?.themeBackup &&<button type="button" className="btn btn-primary float-end" onClick={handlerCancel} ><i className='fas fa-arrow-rotate-left me-2'></i>Reinciar</button>}
        </div>
      </fieldset>
    </Form>
    </div>
  )
}
