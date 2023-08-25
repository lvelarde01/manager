import React ,{useRef,useState,useEffect} from 'react';
import {Form} from 'react-router-dom';
const defaultConfig = {
  search:{
      titleButton: 'Buscar',
      title:'FILTRO DE BUSQUEDA',
      message:'Se guardo exitosamente.',
      classIcon:'fas fa-solid fa-magnifying-glass me-2',
      sizeClass:'col-11 mt-3',   
  },
  form:{
    titleButton: 'Registrar',
    title:'Registro',
    message:'Se guardo exitosamente.',
    classIcon:'fas fa-solid fa-plus me-2',
    sizeClass:'col-11 mt-3',   
},
}

export default function Newmodal({
  children,
  idModal="settingModal",
  title='',
  startModal=false,
  titleButton='',
  msgtype='search',
  classIcon='',
  handlerActionAccept=()=>{},
  handlerActionReset=null,
  handlerActionSubmit,
  actionSubmit=false,
  actionAccept=false,
  actionReset=false
}) {
    const [showModal,setShowModal] = useState(startModal);
    const modalRef = useRef();
    useEffect(()=>{
      console.log('Start Modal  ');
      },[]);
      const handlerClose = ()=>{
        let ModaleditarIntegrante = window.bootstrap.Modal.getInstance(modalRef.current);
          ModaleditarIntegrante.hide();
      };
      const handlerAction = (Event)=>{
        if(typeof handlerActionAccept ===  'function'){
          handlerActionAccept(Event);
          console.log('Action Work');
        } 
        handlerClose();
      }
      const handlerReset = (event)=>{
        if(typeof handlerActionReset ===  'function'){
          handlerActionReset(event);
          console.log('Reset Work');
        } 
      }
      const handlerSubmit = (event)=>{
        if(typeof handlerActionSubmit ===  'function'){
          handlerActionSubmit(event);
          console.log('Submit Work');
        } 
      }

      if(msgtype==="form"){
        return (
          <>
          <Form method='post' onSubmit={handlerSubmit} >
            <div className="modal" ref={modalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" id={`${idModal}`} >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title"><i className={classIcon || defaultConfig?.[msgtype]?.classIcon }></i>{title ||defaultConfig?.[msgtype]?.title }</h5>
                    <button type="button" className="btn-close"   data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {children}
                  </div>
                  <div className="modal-footer justify-content-between">
                  {actionReset &&(
                      <button type="button" className="btn btn-warning float-start" onClick={handlerReset} ><i className="fas fa-trash me-2 "></i>RESET</button>
                  )}
                  <div className='actions'>
                    <button type="button" className="btn btn-danger me-2" onClick={handlerClose} ><i className="fas fa-arrow-rotate-left me-2 "></i>CANCEL</button>
                  {actionSubmit &&(
                    <button type="submit" className="btn btn-primary" ><i className={classIcon || defaultConfig?.[msgtype]?.classIcon }></i>{titleButton ||defaultConfig?.[msgtype]?.titleButton }</button>
                  )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </Form>
          </>
        )

      }
  return (
    <>
    <Form method='post' >
    <div className="modal" ref={modalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" id="settingModal" >
     <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><i className={classIcon || defaultConfig?.[msgtype]?.classIcon }></i>{title ||defaultConfig?.[msgtype]?.title }</h5>
            <button type="button" className="btn-close"   data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer justify-content-between">
            {actionReset &&(
           <button type="button" className="btn btn-warning float-start" onClick={handlerReset} ><i className="fas fa-trash me-2 "></i>RESET</button>
           )}
           <div className='actions'>
            <button type="button" className="btn btn-danger" onClick={handlerClose} ><i className="fas fa-arrow-rotate-left me-2 "></i>CANCEL</button>
           {showModal &&(
            <button type="button" className="btn btn-primary" onClick={handlerAction}  ><i className={classIcon || defaultConfig?.[msgtype]?.classIcon }></i>{titleButton ||defaultConfig?.[msgtype]?.titleButton }</button>
            )}
           
            </div>
          </div>
        </div>
      </div>
    </div>
    </Form>
</>
  )
}
