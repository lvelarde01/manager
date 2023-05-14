import React,{useContext, useEffect, useState} from 'react'
import AuthContext from '../../context/auth-context';
import ThemeContext from '../../context/theme-context';
import MessageContext from '../../context/message-context';
import {Link,useLoaderData} from 'react-router-dom';
import AlertMessage from '../../assets/alertmessage';
import {ActionFetch} from '../../requests/container';
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
  const [deleting,setDeleting] = useState(false);
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
      const dataReceived_vps =  ActionFetch({},'/api/vps/list');
      const dataReceived_collection =  ActionFetch({ fieldsObj:{_id:true,name:true} },'/api/collection/list');
      const dataReceived_container =  ActionFetch({ fieldsObj:{_id:true,name:true,date_upload:true} },'/api/container/list');
      
      const dataVps = await dataReceived_vps;
      const dataCollection = await dataReceived_collection;
      const dataContainer = await dataReceived_container;
      
      const dataCollectionObj = Object.values(dataCollection).reduce((acc,current)=>{
        let values = {[current._id]:current.name};
        return {...acc,...values};
      },{});
      const dataContainerObj = Object.values(dataContainer).reduce((acc,current)=>{
        let values = {[current._id]:{name:current.name,date_upload:current.date_upload}};

        return {...acc,...values};
      },{});

      const result = Object.values(dataVps).reduce((acc,current)=>{
        let {container_id,collection_id,date_upload,...rest} = current;
        //container
        let date = new Date(dataContainerObj[container_id].date_upload);
        date_upload =date.toLocaleDateString('en-gb',{timeZone: "UTC"});
        container_id=dataContainerObj[container_id].name;

        //colection
        collection_id=collection_id.reduce((acc,current) => {
          return [...acc,dataCollectionObj[current._id]];
        },[]).join(', ');

        return [...acc,{container_id,collection_id,date_upload,'checked':true,'del':false,...rest}];
      },[]);
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
    let query = value.toLocaleLowerCase() || null;

    let dataFilter = dataRow.filter((data)=>{
      if(data.name.toLocaleLowerCase().includes(query) || data.container_id.toLocaleLowerCase().includes(query) || data.collection_id.toLocaleLowerCase().includes(query)){
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
    setDeleting(true);
    const result = await ActionFetch(deleteAll,'/api/vps/trashall');
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se Elimino correctamente.'});
        const dataRowFilter = dataRow.length > 1 ? dataRow.filter((data)=>deleteAll.hasOwnProperty(data._id)=== false) : [];
        setDataRow(dataRowFilter);
        setDeleteAll({});
        setDeleting(false);
      },3000);
    }else{
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'danger',message:'Se presento un problema, Por favor, verifique e intente de nuevo.'});
        setDeleting(false);
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
      const dataRowShow = q.length > 0 ? dataRowFilter : dataRow;
       let dataRowCopy = [...dataRowShow];
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
    let result = await ActionFetch({_id},'/api/vps/trash');
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
  const count = dataRowShow.reduce((acc,current)=>{
    return acc + Number(current.pcs);
  },0);
  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {Message.ready && (<AlertMessage sizeClass={"col-12 ms-3 mt-3"} message={Message.message} msgtype={Message.msgtype} typeAlert={"custom"} />) }
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
      
      <div className='row ms-3 mt-3 block-radius-style'>
      <div className='col-6 mb-3 mt-3 ms-5'>
        <input type={'text'} placeholder={'SEARCH BY VPS OR COLLECTION OR CONTAINER'} name={'query'} className={'form-control'} value={q} onChange={(e)=>{handlerSearch(e.currentTarget.value);setQ(e.currentTarget.value)}} />
      </div>
      
      <div className='col-4 mb-3 mt-3 '>
        <button className='btn btn-primary'><i className='fas fa-search me-2'></i>Buscar</button>
        <button className={`btn btn-primary ${Object.keys(deleteAll).length === 0 || deleting ? 'disabled':''} ` } onClick={handlerDeleteAll} >
        {deleting ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Eliminando..</span></>  : <><i className='fas fa-trash me-2'></i>Eliminar ( {Object.keys(deleteAll).length} )</> }
          
          </button>

      </div>
      <h2>RESULT SEARCH</h2>
      <div className='table-responsive' style={{overflowY:'scroll',height:'500px'}}>
      <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col"><input disabled={dataRowShow.length ===0?true:false} type={'checkbox'} name={"field"} checked={Object.keys(deleteAll).length === dataRowShow.length &&  dataRow.length > 0 ? true : false} onChange={handlerCheckAll} title={'Seleccionar todos'}/></th>
              <th scope="col">VPS#</th>
              <th scope="col">PCS</th>
              <th scope="col">COLLECTIONS</th>
              <th scope="col">CONTAINER</th>
              <th scope="col">DATE CONTAINER</th>
              <th scope="col">DATE REGISTER</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {dataRowShow&&dataRowShow.map((data)=>(
                <tr key={data._id}>
                <th scope="row"><input type={'checkbox'} checked={deleteAll.hasOwnProperty(data._id) ? true : false} name={"field"} value={data._id} onChange={handlerCheck}/></th>
                <td className='text-nowrap'>{data.name}</td>
                <td>{data.pcs}</td>
                <td >{data.collection_id}</td>
                <td className='text-nowrap'>{data.container_id}</td>
                <td >{data.date_upload}</td>
                <td>{data.utc}</td>
                <td><Link className={`btn btn-primary ${loading?`disabled`:``}`} onClick={handlerEdit} to={`/vps/edit/${data._id}`}><i className='fas fa-pencil'/></Link>
                </td>

              </tr>
            ))}
            {dataRowShow.length===0? <><tr><th className='text-center' colSpan={7}>No hay Registros</th></tr></> : ''}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={2}>Total de PCS</th>
              <td>
                {count}
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Total de Registros</th>
              <td>
                {dataRowShow.length}
              </td>
            </tr>
          </tfoot>
        </table>
        </div>
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
