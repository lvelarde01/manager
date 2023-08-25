import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import NavbarCustom from '../../assets/NavbarCustom'
import FooterCustom from '../../assets/FooterCustom'
import StoreView from '../../assets/storeView';
import { ActionFetch } from '../../requests/utilsApis';


export async function loader({ request }) {
    console.log("Home");
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    //const contacts = await getContacts(q);
      return {q};
    }

export function Home() {
  const [inputSearch,SetInputSearch] =  useState("");
  const [data,SetData] =  useState([]);

  const handlerSearch = async(event)=>{
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    console.log({data})
    const result = await ActionFetch({dataObj:data,UrlFetch:'/api/store/search'});
    SetData(result);
    //console.log({result});
  }
  

  return (
        <>
          <NavbarCustom>
               <form className="d-flex" onSubmit={handlerSearch}>
                <input className="form-control" type="search" name='query' onChange={(e)=>SetInputSearch(e.currentTarget.value)} style={{width:"600px"}} placeholder="Buscar Tienda o Comida" aria-label="Buscar tienda o comida"/>
                <button className="btn btn-primary" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
              </form>
          </NavbarCustom>
          <div className='container-fluid' style={{marginTop:"60px"}} >
              <div className='row'>
                <div className='col-3 pt-5'>
                      <ul className="list-group">
                        <li className="list-group-item active" aria-current="true">Recomendado</li>
                        <li className="list-group-item">Mas Populares</li>
                        <li className="list-group-item">Valoracion</li>
                        <li className="list-group-item">Tiempo de Entrega</li>
                        <li className="list-group-item">Otros</li>
                      </ul>
                      <div className="form-check mt-2" >
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1"/>
                        <label className="form-check-label">
                          Domicilio
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
                        <label className="form-check-label">
                          Recogida
                        </label>
                      </div>
                      <div className="d-grid mt-2">
                        <button type="button" className="btn btn-primary btn-block"><i className="fa-solid fa-location-dot me-2"></i>Mi Ubicacion</button>
                      </div>
                </div>
                      <div className='col-9 pt-5'>
                        <h4 className='text-center'>Tiendas Disponibles</h4>
                              <div className='row' style={{maxHeight:"500px",maxWidth:"auto",overflowY:"scroll",overflowX:"hidden"}} ><StoreView data={data} /></div>
                        </div>
              </div>
          </div>
          <FooterCustom />
        </>
      )
}
