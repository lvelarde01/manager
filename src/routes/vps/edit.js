import React,{useContext,useState,useEffect} from 'react'
import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp} from '../../requests/users';
import { ActionFetch } from '../../requests/container';
import {schema_vps} from '../../requests/rules';
import AlertMessage from '../../assets/alertmessage';
import { MultiSelect } from "react-multi-select-component";



export async function loader( {params} ) {
    const FetchVps =  ActionFetch({_id:params.id},'/api/vps/getinfo');
    const FetchContainer =  ActionFetch({fieldsObj:{_id:true,name:true}},'/api/container/list');
    const FetchCollection = await ActionFetch({fieldsObj:{_id:true,name:true}},'/api/collection/list');

    let dataInfo = await FetchVps;
    let resultcontainer = await FetchContainer;

    dataInfo.collection_id = Object.values(dataInfo.collection_id).reduce((acc,current)=>{
        const Collection = Object.values(FetchCollection).find((value)=>{
            if(value._id ===current._id){
                return value;
            }
        });
        if(Collection?.name){
        let values = {label:Collection.name || "",value:current._id};
            return [...acc,values];
          }
          return [...acc];
      },[]);
      const nameArray = dataInfo?.name.split('-');  
      dataInfo.name = Number(nameArray[1]) || 0; 
    const allContainers = Object.values(resultcontainer) || [];

    const allCollection = Object.values(FetchCollection).reduce((acc,current)=>{
      let values = {label:current.name,value:current._id};
      return [...acc,values];
    },[]);
    return {dataInfo,allContainers,allCollection};
    }



export function Edit() {
    const {dataInfo,allContainers,allCollection} = useLoaderData();
    const navigate = useNavigate();
    const {Auth} = useContext(AuthContext);
    const [loading,setLoading] = useState(false);
    const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
    const [errors,setErrors] = useState({});
    const [selected, setSelected] = useState(dataInfo.collection_id);




    const handlerOnchange = (event)=>{
    const nameField = event.target.name;
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
    const {error,dataUserObj} = await startUp({data,schema:schema_vps,ignoreRules:{name:{rules:[{'isUnique':true}]}}});
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
    const result = await ActionFetch({...dataUserObj,_id:dataInfo._id,'collection_id':dataCollection},'/api/vps/edit');
    if(result.acknowledged){
        setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se guardo correctamente.'});
        setLoading(false);
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
        <h2>MODIFICAR VPS</h2>
        </div>
        <legend>INFORMACION</legend>
        <div className="mb-3">
        <select className="form-select" name='container_id' defaultValue={dataInfo?.container_id} required onChange={handlerOnchange} >
          {allContainers.map((value)=>(
            <option key={value._id} value={value._id}>{value.name}</option>
          ))}
          </select>
          {errors?.container_id && <p className='text-center text-danger mx-1 mt-1' >*{errors.container_id}*</p>}
        </div>
        <div className="mb-3">
          <input type="number" min={1} name='name' className="form-control" defaultValue={dataInfo.name} required placeholder="VPS-#" onChange={handlerOnchange}/>
          {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>
        <div className="mb-3">
          <input type="number" min={1} name='pcs' className="form-control" defaultValue={dataInfo.pcs} required placeholder="PSC" onChange={handlerOnchange}/>
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
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>Guardar</> }
            </button>
            <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/vps/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>Cancelar</button>

        </div>
        </fieldset>
    </Form>
    </div>
    </div>
    )
}

