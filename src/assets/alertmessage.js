import React,{useState,useEffect} from 'react'
const defaultConfig = {
  success:{
      message:'Se guardo exitosamente.',
      classIcon:'fas fa-floppy-disk me-2',
      sizeClass:'col-11 mt-3',   
  },
  danger:{
    message:'Se presento un problema. Por favor, verifique e intente de nuevo.',
    classIcon:'fas fa-triangle-exclamation me-2',
    sizeClass:'col-11 mt-3',   
  },
  info:{
    message:'Se informa que todo funciono correctamente.',
    classIcon:'fas fa-circle-info me-2',
    sizeClass:'col-11 mt-3',   
  }
}
export default function AlertMessage({message='', msgtype='success',sizeClass='',classIcon=''}) {
  const [show,setShow]=useState(true);
  useEffect(()=>{
    setTimeout(()=>{
      console.log('alert hide');
      setShow(false);
    },3000)
  },[]);  
  
  return (
    <div className={`alert alert-${msgtype} alert-dismissible  ${sizeClass || defaultConfig?.[msgtype]?.sizeClass}  ${!show? 'collapse' : '' } `}>
            <i className={classIcon || defaultConfig?.[msgtype]?.classIcon }></i>{defaultConfig?.[msgtype]?.message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}
