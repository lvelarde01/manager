import React,{useContext,useEffect,useState,useRef} from 'react'
import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp} from '../../requests/users';
import {ActionFetch} from '../../requests/container';
import {schema_vps} from '../../requests/rules'
import AlertMessage from '../../assets/alertmessage';
import { MultiSelect } from "react-multi-select-component";

export async function loader({ request }) {
    console.log("Add");
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    //const contacts = await getContacts(q);
        return {q};
}
    
export function Add() {
  const {Auth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});
  const [selected, setSelected] = useState([]);
  const [allContainers,setAllContainers] = useState([]);
  const [allCollection,setAllCollection] = useState([]);
  const [loadDataContainer,setLoadDataContainer] = useState(false);
  const [loadDataCollection,setLoadDataCollection] = useState(false);
  const selectContainer = useRef();
  const dataUserObj = useLoaderData();
  const navigate = useNavigate();

  useEffect(()=>{
    if(loadDataContainer)return;
    async function loadContainer(){
      const data = await ActionFetch({fieldsObj:{_id:true,name:true}},'/api/container/list');
      const result = Object.values(data) || [];
      setAllContainers(result);
      setLoadDataContainer(true);
    }
    loadContainer().catch((error)=>{
      console.warn("Error de carga de data");
    });
  },[loadDataContainer]);

  useEffect(()=>{
    if(loadDataCollection)return;
    async function loadCollections(){
      const data = await ActionFetch({fieldsObj:{_id:true,name:true}},'/api/collection/list');
      const result = Object.values(data).reduce((acc,current)=>{
        let values = {label:current.name,value:current._id};
        return [...acc,values];
      },[]);
      console.log(result);
      setAllCollection(result);
      setLoadDataCollection(true);
    }
    loadCollections().catch((error)=>{
      
      console.warn(error);
    });
  },[loadDataCollection]);



  const handlerOnchange = (event)=>{
    const nameField = event.currentTarget.name;
    if(event.currentTarget.type==='text'){
      let value =event.currentTarget.value;
      event.currentTarget.value=value.toUpperCase();
    }
    const {[nameField]:cpNameField,...cpErrors} = {...errors};
    if(cpNameField){ 
      setErrors({...cpErrors});
    }
  }

  const handlerOnSubmit = async (event)=>{
    event.preventDefault();
    setLoading(true);
    setFetchReady({ready:false,msgtype:'success',message:'default'});
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const dataCollection = selected.reduce((acc,current)=>{
      const value = {_id:current.value};
      return [...acc,value]
    },[]);
    data['collection_id'] = dataCollection || [];
    const {error,dataUserObj} = await startUp({data,schema:schema_vps});
    if(Object.entries(error).length > 0){
        setTimeout(()=>{
          setFetchReady({ready:true,msgtype:'danger',message:''});
          setErrors({...error});
          setLoading(false);
        },3000);
        return;
    }
    console.log("NO ERRORS");
    dataUserObj['name']=`VPS-${dataUserObj['name']}`;
    const result = await ActionFetch({...dataUserObj},'/api/vps/add');
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se guardo correctamente.'});
        setLoading(false);
        selectContainer.current.value = "";
        event.target.name.value = '';
        event.target.pcs.value = '';
        setSelected([]);

      },3000);
    }else{
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'danger',message:'Se presento un problema, Por favor, verifique e intente de nuevo.'});
        setLoading(false);
        setErrors({...result});
      },3000);
    }
  }





  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
        <Form className='col-12 mt-3' method='post' onSubmit={handlerOnSubmit} >
      <fieldset>
      <div className="mb-3">
        <h2>REGISTRO DE VPS</h2>
      </div>
        <legend>INFORMACION</legend>
        <div className="mb-3">
        <select className="form-select" name='container_id' ref={selectContainer} required onChange={handlerOnchange} >
          <option value={""}>SELECT CONTAINER</option>
          {allContainers.map((value)=>(
            <option key={value._id} value={value._id}>{value.name}</option>
          ))}
          </select>
          {errors?.container_id && <p className='text-center text-danger mx-1 mt-1' >*{errors.container_id}*</p>}
        </div>
        <div className="mb-3">
          <input type="number" min={1} name='name' className="form-control" required placeholder="VPS-#" onChange={handlerOnchange}/>
          {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>
        <div className="mb-3">
          <input type="number" min={1} name='pcs' className="form-control" required placeholder="PSC" onChange={handlerOnchange}/>
          {errors?.pcs && <p className='text-center text-danger mx-1 mt-1' >*{errors.pcs}*</p>}
        </div>
        <div className="mb-3">
            <MultiSelect
            options={allCollection}
            value={selected}
            onChange={setSelected}
            labelledBy="Select"
            className={'form-control'}
          />
          {errors?.collection_id && <p className='text-center text-danger mx-1 mt-1' >*{errors.collection_id}*</p>}

        </div>
        <div className="mb-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>Registrar</> }
            </button>
          <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/vps/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>Cancelar</button>

        </div>
      </fieldset>
    </Form>
    </div>
    </div>
  )
}
