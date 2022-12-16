import React,{useContext,useState,useRef} from 'react'
import { updateinfoUser,getBase64 } from '../../requests/users';
import AuthContext from '../../context/auth-context';
import {Form} from 'react-router-dom';

export default function ImageProfile({FetchReady}) {
  const {Auth,handlerAuth} = useContext(AuthContext);
  const [btnSave,setBtnSave] = useState({loading:false,disable:false});
  const [btnUpload,setBtnUpload] = useState({loading:false,disable:false});
  const [btnDelete,setbtnDelete] = useState({loading:false,disable:false});
  const inputFileRef = useRef( null );
  
  const onFilechange = ( event ) => {
    const dataUserObj = {...Auth};
    const dataImageObj = event.target.files[0];
    if(!dataImageObj)return;
    setBtnUpload({loading:true,disable:true});
    getBase64(dataImageObj).then((data)=>{
      dataUserObj.urlImage = data; 
      handlerAuth({...dataUserObj});
      setTimeout(()=>{
        setBtnUpload({loading:false,disable:false});
      },3000);
    });
  }
  const handlerUpload = ()=>{
    inputFileRef.current.click();
  }
  
  const handleSubmitImage = async() =>{
    if(!Auth.urlImage)return;
    FetchReady(false);
    setBtnSave({loading:true,disable:true});
    setbtnDelete({loading:false,disable:true});
    const result = await updateinfoUser({photo:Auth.urlImage});
    if(result.acknowledged){
        setTimeout(()=>{
          const dataUserObj = {...Auth};
          dataUserObj.photo = Auth.urlImage;
          dataUserObj.urlImage = '';
          handlerAuth({...dataUserObj});
            FetchReady(true);
            setBtnSave({loading:false,disable:false});
            setbtnDelete({loading:false,disable:false});
        },3000);
    }
  };
  const handlerDeleteImage =  () =>{
    FetchReady(false);
    setbtnDelete({loading:true,disable:true});
    setBtnSave({loading:false,disable:true});
    setBtnUpload({loading:false,disable:true});
          setTimeout(()=>{
            const dataUserObj = {...Auth};
            if(Auth.urlImage){
              dataUserObj.urlImage = "";
            }else if(Auth.photo){
              dataUserObj.photo = "";
               updateinfoUser({photo:""});
            }
            handlerAuth({...dataUserObj});
              FetchReady(true);
              setbtnDelete({loading:false,disable:false});
              setBtnSave({loading:false,disable:false});
              setBtnUpload({loading:false,disable:false});
          },3000);
  }
    return (
        <Form className='col-2 mt-3' id='profile' method='post' >
        <div className="mb-3">
            <h2>&nbsp;</h2>
          </div>
        <fieldset>
          <legend>Foto</legend>
          <div className="mb-1 mt-1 d-grid">
            <img  className=' img-fluid rounded mx-auto d-block' alt='Imagen de Perfil' src={ Auth.urlImage || Auth.photo || "/blank.png"}  />
            </div>
            <input
              type="file"
              ref={inputFileRef}
              style={{"display":'none'}}
              accept={".jpeg, .png, .jpg"}
              onChange={onFilechange}
            />
              { (!Auth.urlImage)&&<div className="mb-1 mt-1 d-grid">
                <button type="button" className="btn btn-primary " onClick={handlerUpload} disabled={btnUpload.disable}>
                  {btnUpload.loading? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Cargando</span></>  : <><i className="fas fa-cloud-upload me-2"></i>Cargar</> }
                </button>
              </div>}
              {Auth.urlImage&&<div className="mb-2 d-grid">
                <button type="button" className="btn btn-primary " onClick={handleSubmitImage}  disabled={btnSave.disable}>
                  {btnSave.loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando</span></>  : <><i className="fas fa-floppy-disk me-2"></i>Guarda</> }
                </button>
              </div>}
             { (Auth.urlImage||Auth.photo)&& <div className="mb-2 d-grid">
                <button type="button" onClick={handlerDeleteImage} className="btn btn-primary " disabled={btnDelete.disable}>
                  {btnDelete.loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Eliminando</span></>  : <><i className="fas fa-trash me-2"></i>Eliminar   </> }
                </button>
              </div>}
              
        </fieldset>
        </Form>
  )
}
