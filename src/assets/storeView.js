import React from 'react'
import { Link } from 'react-router-dom';


export default function storeView({data=[]}) {
  return (
        data.map((data,index)=>
        <div key={index} className="col-3 p-2 me-2 mt-2" style={{border:"1px solid gray",borderRadius:"10px",minHeight:"300px"}}>
        <Link to={`/stores/profile/${data?._id}`} style={{textDecoration:"none !important",color:"black"}}>
        <img src={data?.photo} style={{height:" 200px",width: "200px"}} className="rounded mx-auto d-block" alt="..."/>
        </Link>
        <h6 className="text-center mt-1">{data?.name} <span className="badge bg-secondary ">{ ((Number(data?.likes) / Number(data?.likes + data?.dislike)) * 5).toFixed(1)}</span></h6>
        <h6 className="text-center mt-1">Gasto de Envio: <span style={{color:"green"}}>1.33$</span></h6>
        <h6 className="text-center mt-1">Timpo: <span style={{color:"red"}}>{data?.time_delivery_start} Min- {data?.time_delivery_end} Min</span></h6>
        </div>
        )
  )
}
