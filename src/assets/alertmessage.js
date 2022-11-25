import React from 'react'

export default function AlertMessage({Elementshow=true}) {
    if(!Elementshow)return (<></>);

  return (
    <div className='alert alert-success alert-dismissible col-11 mt-3'>
            <i className='fas fa-floppy-disk me-2'></i>Se Actualizo Correctamente
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}
