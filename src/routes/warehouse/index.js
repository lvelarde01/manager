import React,{useContext, useEffect, useState} from 'react'
import AuthContext from '../../context/auth-context';
import ThemeContext from '../../context/theme-context';
import MessageContext from '../../context/message-context';
import {Link,useLoaderData} from 'react-router-dom';
import AlertMessage from '../../assets/alertmessage';
import {getAllWarehouse,TrashWarehouse,TrashAllWarehouse} from '../../requests/users';
export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    return {q};
    }

export function Index() {
  const {Auth,handlerAuth} = useContext(AuthContext);
  const {theme,handlerTheme} = useContext(ThemeContext);
  const {Message,handlerMessage} =  useContext(MessageContext);
  const allData = useLoaderData();
  const [loading,setLoading] = useState(false);
  const [dataRow,setDataRow] = useState([]);
  const [deleteAll,setDeleteAll] = useState({});
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [searchParam] = useState(["name"]);
  const [q, setQ] = useState("");
  const [dataRowFilter,setDatarowFilter] = useState([]);
  const [loadingData,setLoadingData] = useState(false);
  useEffect(()=>{
    if(loadingData)return;
      async function loadData(){
      const listWarehouse = await getAllWarehouse({});
      const result = Object.values(listWarehouse).map((value)=>{
        return {...value,'checked':true,'del':false};
      });
      console.log('Primera Vez');
      setDataRow(result);
      setLoadingData(true);
    }
    loadData().catch((e)=>{
      console.log(e);
      console.log("error load data");
    });

  },[dataRow]);

  const handlerSearch = async(value)=>{
    if(!value){
      setDatarowFilter([]);
      return;
    }
    let dataFilter = dataRow.filter((data)=>{
      if(data.name.toLocaleLowerCase().includes(value) ||
      data.name.toLocaleLowerCase().includes(value)){
        return data
      }
    });
    setDatarowFilter(dataFilter);

  }
  const handlerEdit = async(event)=>{
    if(!window.confirm('Desea ir a modificar el registro ?')){
      event.preventDefault();
      return;
    }
    
  }
  const handlerDeleteAll = async(event)=>{
    event.preventDefault();
    if(!window.confirm('Desea Eliminar todos los Registros seleccionados ?')){
      return;
    }
    const result = await TrashAllWarehouse(deleteAll);
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se Elimino correctamente.'});
        const dataRowFilter = dataRow.length > 1 ? dataRow.filter((data)=>deleteAll.hasOwnProperty(data._id)=== false) : [];
        setDataRow(dataRowFilter);
      },3000);
    }else{
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'danger',message:'Se presento un problema, Por favor, verifique e intente de nuevo.'});
      },3000);
    }
    
  }
  const handlerCheck = async(event)=>{
    const _id = event.currentTarget.value || null;
    if(!_id)return;
    if(event.currentTarget.checked){
      setDeleteAll({...deleteAll,[_id]:'_id'});
    }else{
      let deleteAllCopy = {...deleteAll};
      delete deleteAllCopy[_id];
      setDeleteAll({...deleteAllCopy});
    }

  }
  const handlerCheckAll = async(event)=>{
    if(event.currentTarget.checked){
       let dataRowCopy = [...dataRow];
      let result = dataRowCopy.reduce((key,index,array)=>{
        return {...key,[index._id]:'_id'}
      },{});
      setDeleteAll(result);
    }else{
      setDeleteAll({});
    }
  }

  const handlerTrash = async(event)=>{
    event.preventDefault();
    if(!window.confirm('Desea Eliminar Este Registro ?')){
      return;
    }
    setLoading(true);
    const _id = event.currentTarget.id;
    let dataRowCopy = [...dataRow];
    dataRowCopy = dataRow.map((value)=>{
      if(value._id === _id){
        value.edit=true;
      }
      return value;
    });
    setDataRow(dataRowCopy);
    let result = await TrashWarehouse({_id});
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se Elimino correctamente.'});
        const dataRowFilter = dataRow.length > 1 ? dataRow.filter((data)=>data._id !==_id) : [];
        setDataRow(dataRowFilter);
        setLoading(false);
      },3000);
    }else{
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'danger',message:'Se presento un problema, Por favor, verifique e intente de nuevo.'});
        setLoading(false);
      },3000);
    }
    
  }
  const dataRowShow = q.length >0 ? dataRowFilter : dataRow;
  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {Message.ready && (<AlertMessage sizeClass={"col-12 ms-3 mt-3"} message={Message.message} msgtype={Message.msgtype} typeAlert={"custom"} />) }
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
      
      <div className='row ms-3 mt-3 block-radius-style'>
      <div className='col-6 mb-3 mt-3 ms-5'>
        <input type={'text'} placeholder={'buscar por nombre'} name={'query'} className={'form-control'} value={q} onChange={(e)=>{handlerSearch(e.currentTarget.value);setQ(e.currentTarget.value)}} />
      </div>
      
      <div className='col-4 mb-3 mt-3 '>
        <button className='btn btn-primary'><i className='fas fa-search me-2'></i>Buscar</button>
        <button className={`btn btn-primary ${Object.keys(deleteAll).length === 0 ? 'disabled':''} ` } onClick={handlerDeleteAll} ><i className='fas fa-trash me-2'></i>Eliminar</button>

      </div>
      <h2>Resultado de la busqueda</h2>
      <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col"><input disabled={dataRow.length ===0?true:false} type={'checkbox'} name={"field"} value={'as'} checked={Object.keys(deleteAll).length === dataRow.length &&  dataRow.length > 0 ? true : false} onChange={handlerCheckAll} title={'Seleccionar todos'}/></th>
              <th scope="col">Nombre</th>
              <th scope="col">Fecha de Registro</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {dataRowShow&&dataRowShow.map((data)=>(
                <tr key={data._id}>
                <th scope="row"><input type={'checkbox'} checked={deleteAll.hasOwnProperty(data._id) ? true : false} name={"field"} value={data._id} onChange={handlerCheck}/></th>
                <td>{data.name}</td>
                <td>{data.utc}</td>
                <td><Link className={`btn btn-primary ${loading?`disabled`:``}`} onClick={handlerEdit} to={`/warehouse/edit/${data._id}`}><i className='fas fa-pencil'/></Link>
                    <Link id={data._id} onClick={handlerTrash}  disabled={loading}  className={`btn btn-primary ${loading?`disabled`:``}`}>
                          {data.edit ? <><i className="spinner-grow spinner-grow-sm me-2"></i></>  : <><i className="fas fa-trash"></i></> }
                    </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item"><Link className="page-link btn-primary me-0" href="#">Anterior</Link></li>
            <li className="page-item"><Link className="page-link btn-primary" href="#">1</Link></li>
            <li className="page-item"><Link className="page-link btn-primary" href="#">2</Link></li>
            <li className="page-item"><Link className="page-link btn-primary" href="#">3</Link></li>
            <li className="page-item"><Link className="page-link btn-primary ms-0" href="#">Siguiente</Link></li>
          </ul>
        </nav>
        </div>
    </div>
  )
}
