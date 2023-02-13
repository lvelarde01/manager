import React,{useState,useEffect} from 'react'
const defaultConfig = {
  success:{
      title: 'Exito!',
      message:'Se guardo exitosamente.',
      classIcon:'fas fa-floppy-disk me-2',
      sizeClass:'col-11 mt-3',   
  },
  danger:{
    title: 'Error!',
    message:'Se presento un problema. Por favor, verifique e intente de nuevo.',
    classIcon:'fas fa-triangle-exclamation me-2',
    sizeClass:'col-11 mt-3',   
  },
  warning:{
    title: 'Alerta!',
    message:'Se presento un problema. Por favor, verifique e intente de nuevo.',
    classIcon:'fas fa-triangle-exclamation me-2',
    sizeClass:'col-11 mt-3',   
  },
  info:{
    title: 'Informacion!',
    message:'Se informa que todo funciono correctamente.',
    classIcon:'fas fa-circle-info me-2',
    sizeClass:'col-11 mt-3',   
  }
}
export default function AlertMessage({message='', msgtype='success',sizeClass='',classIcon='',typeAlert='default',title=''}) {
  const [show,setShow]=useState(true);
  useEffect(()=>{
    setTimeout(()=>{
      console.log('alert hide');
      setShow(false);
    },5000)
  },[]);  
  if(typeAlert==='custom'){
    return (
       <div className={`alert alert-${msgtype} new p-4  ${sizeClass || defaultConfig?.[msgtype]?.sizeClass}  ${!show? 'collapse' : '' } `}>
       <button type="button" className={"btn-close close"} data-bs-dismiss="alert" aria-label="Close"></button>
         <strong><i className={classIcon || defaultConfig?.[msgtype]?.classIcon }></i>{title ||defaultConfig?.[msgtype]?.title }</strong>
         <p className={"mb-0"}>{message || defaultConfig?.[msgtype]?.message}</p>
       </div>
    )
  }

  return (
    <div className={`alert alert-${msgtype} alert-dismissible  ${sizeClass || defaultConfig?.[msgtype]?.sizeClass}  ${!show? 'collapse' : '' } `}>
            <i className={classIcon || defaultConfig?.[msgtype]?.classIcon }></i>{message || defaultConfig?.[msgtype]?.message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}
