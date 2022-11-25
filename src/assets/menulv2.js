import React from 'react';
import {Link} from 'react-router-dom';

export default function menulv2({dataObjChildren,ElementShow,handlerAuth}) {
    if(!dataObjChildren)return (<></>);

  return (
    <div key={1} className={ElementShow ? "collapse show" : "collapse"} >
        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            {
                Object.keys(dataObjChildren.childrens).map(function(key) {
                  if(dataObjChildren.childrens[key].path==="/logout")return <li key={dataObjChildren.childrens[key].name} ><Link onClick={()=>{handlerAuth({token:null})}} to={dataObjChildren.childrens[key].path} className="text-white"><i className={dataObjChildren.childrens[key].classicon}></i>{dataObjChildren.childrens[key].name}test</Link></li>;
                return <li key={dataObjChildren.childrens[key].name} ><Link to={dataObjChildren.childrens[key].path} className="text-white"><i className={dataObjChildren.childrens[key].classicon}></i>{dataObjChildren.childrens[key].name}</Link></li>;
                })
            }
        </ul>
    </div>
  )
}
