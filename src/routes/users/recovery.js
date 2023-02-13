import React ,{useRef,useState,useEffect} from 'react';
import {Form} from 'react-router-dom';
import { startUp , recoveryPassword,schema_recovery } from '../../requests/users';
import AlertMessage from '../../assets/alertmessage';

export default function Recovery() {
    const modalRef = useRef();
    const [loading,setLoading] = useState(false);
    const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
    const [errors,setErrors] = useState({});
    
    
    useEffect(()=>{
      if(fetchReady.ready && Object.entries(errors).length === 0){
        let ModaleditarIntegrante = window.bootstrap.Modal.getOrCreateInstance(modalRef.current);
        setTimeout(()=>{  
          ModaleditarIntegrante.hide();
        },4000);
      }
    },[fetchReady]);

    const handlerOnSubmit = async (event) =>{
      event.preventDefault();
      setLoading(true);
      setFetchReady({ready:false,msgtype:'success',message:'default'});
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData);
      const {error,dataUserObj} = await startUp({data,schema:schema_recovery});
      if(Object.entries(error).length > 0){
          setTimeout(()=>{
            setFetchReady({ready:true,msgtype:'danger',message:''});
            setErrors({...error});
            setLoading(false);
          },3000);
          return;
      }
      const result = await recoveryPassword({...dataUserObj});
      if(result.acknowledged){
        setTimeout(()=>{
          setFetchReady({ready:true,msgtype:'success',message:'Se ha enviado un correo con las instrucciones para la recuperacion de contrasena.'});
          event.target.email.value = '';
          setLoading(false);
        },3000);
      }
      if(result.errors){
        setTimeout(()=>{
          setFetchReady({ready:true,msgtype:'danger',message:''});
          setErrors({...result.errors});
          setLoading(false);
        },3000);
      }
    }
    const handlerOnchange = (event)=>{
      const nameField = event.target.name; 
      const {[nameField]:cpNameField,...cpErrors} = {...errors};
      if(cpNameField){ 
        setErrors({...cpErrors});
      }
    }
  return (
    <>
    <Form method='post' onSubmit={handlerOnSubmit} >
    <div className="modal" ref={modalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" id="recoveryModal" >
     <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Recuperar Contrasena</h5>
            <button type="button" className="btn-close" disabled={loading}  data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {fetchReady.ready && (<AlertMessage sizeClass={"col-12"} message={fetchReady.message} msgtype={fetchReady.msgtype} />) }
            <input name='email' type='email' required onChange={handlerOnchange} className='form-control' placeholder='Correo Electronico' />
            {errors?.email && <p className='text-center text-danger mx-1 mt-1' >*{errors.email}*</p>}

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" disabled={loading} data-bs-dismiss="modal"><i className="fas fa-arrow-rotate-left me-2 "></i>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading} ><i className="fas fa-envelope me-2"></i>Recuperar</button>
          </div>
        </div>
      </div>
    </div>
    </Form>
</>
  )
}
