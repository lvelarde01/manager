import React,{useContext, useState} from 'react';
import {useLoaderData,useNavigate, Form} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {getinfoUser,updateinfoUser} from '../../requests/users';
import AlertMessage from '../../assets/alertmessage';
import ImageProfile from './imageprofile';
export async function loader({ request }) {
    const dataUserObj = await getinfoUser();
    return {...dataUserObj};
  }
  
export async function action({ request, params }) {
  }



export default function Profile() {
  const {Auth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});

  const dataUserObj = useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (event) =>{
    event.preventDefault();
    setLoading(true);
    setFetchReady({ready:false,msgtype:'success',message:'default'});
    const formData = new FormData(event.currentTarget);
    const updates = Object.fromEntries(formData);
    const result = await updateinfoUser(updates);
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:''});
        setLoading(false);
      },3000);
    }
  }


  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
            <Form className='col-9 mt-3' method='post' onSubmit={handleSubmit}  >
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
                  
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Actualizando</span></>  : <><i className="fas fa-floppy-disk me-2"></i>Guardar</> }
                  </button>
                  <button type="button" onClick={()=>{navigate('/')}} className="btn btn-primary float-end"><i className='fas fa-arrow-rotate-left me-2'></i>Regresar</button>

                </div>
              </fieldset>
            </Form>
            <ImageProfile FetchReady={setFetchReady} />
    </div>
    </div>
  )
}
