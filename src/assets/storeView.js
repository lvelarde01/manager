import React from 'react'
import { Link } from 'react-router-dom';


export default function storeView({data=[]}) {
  return (
        data.map((data,index)=>
        <div key={index} className="col-3 p-2 me-2 mt-2" style={{border:"1px solid gray",borderRadius:"10px",minHeight:"300px"}}>
        <Link to="#" style={{textDecoration:"none !important",color:"black"}}>
        <img src="https://media.istockphoto.com/id/1387134070/es/foto/concepto-de-sistemas-de-gesti%C3%B3n-de-tiendas-inteligentes.jpg?s=2048x2048&w=is&k=20&c=DBt4h3Y8BBOKfqO76P9OuwQtcJvJfVrND-084kUFhsQ=" style={{height:" 200px",width: "200px"}} className="rounded mx-auto d-block" alt="..."/>
        </Link>
        <h6 className="text-center mt-1">Mc Donals <span className="badge bg-secondary ">5.3</span></h6>
        <h6 className="text-center mt-1">Gasto de Envio: <span style={{color:"green"}}>1.33$</span></h6>
        <h6 className="text-center mt-1">Timpo: <span style={{color:"red"}}>20 Min- 30 Min</span></h6>
        </div>
        )
  )
}
