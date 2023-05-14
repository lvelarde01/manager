import React from 'react'

export default function Spingloading() {
  return (
    <div className='vh-100 d-flex justify-content-center align-items-center'>
              <img src='/img/loading.gif' className='me-2' style={{width:"30px",height:"30px"}} alt='Loading'></img><span className='me-2 mr-2'>Cargando..</span>
    </div>
  )
}
