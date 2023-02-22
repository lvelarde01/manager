import React,{useContext,useState} from 'react'
import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp} from '../../requests/users';
import { ActionFetch } from '../../requests/container';
import {schema_container} from '../../requests/rules';
import AlertMessage from '../../assets/alertmessage';


export async function loader( {params} ) {
    let result = await ActionFetch({_id:params.id},'/api/container/getinfo');
    console.log(result)
    return result;
    }



export function Edit() {
    const {Auth} = useContext(AuthContext);
    const [loading,setLoading] = useState(false);
    const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
    const [errors,setErrors] = useState({});

    const dataInfo = useLoaderData();
    const navigate = useNavigate();

    const handlerOnchange = (event)=>{
    const nameField = event.target.name; 
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
    
    const {error,dataUserObj} = await startUp({data,schema:schema_container});
    if(Object.entries(error).length > 0){
        setTimeout(()=>{
            setFetchReady({ready:true,msgtype:'danger',message:''});
            setErrors({...error});
            setLoading(false);
        },3000);
        return;
    }
    console.log("NO ERRORS");
    const result = await ActionFetch({...dataUserObj,_id:dataInfo._id},'/api/container/edit');
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
        <div className='row ms-3 mt-3 block-radius-style' style={{overflowY:'auto', maxHeight:'600px'}}>
        <Form className='col-12 mt-3' method='post' onSubmit={handlerOnSubmit} >
      <fieldset>
      <div className="mb-3">
        <h2>REGISTRO DE CONTAINER</h2>
      </div>
        <legend>Informacion</legend>
        <div className="mb-3">
          <input type="text" name='name' defaultValue={dataInfo.name} className="form-control" required placeholder="Nombre de container" onChange={handlerOnchange}/>
          {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>
        <div className="mb-3">
          <input type="date" name='date_upload' defaultValue={dataInfo.date_upload} className="form-control" required placeholder="Unloading Date mm/dd/yyyy" onChange={handlerOnchange}/>
          {errors?.date_upload && <p className='text-center text-danger mx-1 mt-1' >*{errors.date_upload}*</p>}
        </div>
        <div className="mb-3">
        <select className="form-select" name='warehouse' defaultValue={dataInfo.warehouse} required onChange={handlerOnchange} >
            <option value={"DLS03"}>DLS03</option>
            <option value={"DLS04"}>DLS04</option>
          </select>
          {errors?.date_upload && <p className='text-center text-danger mx-1 mt-1' >*{errors.date_upload}*</p>}
        </div>
        <div className="mb-3">
        <select className="form-select" name='typeunload'  defaultValue={dataInfo.typeunload} required onChange={handlerOnchange} >
          <option value={null}>Tipo de Descarga</option>
            <option value={"drop"}>Drop</option>
            <option value={"live unload"}>Live Unload</option>
          </select>
          {errors?.typeunload && <p className='text-center text-danger mx-1 mt-1' >*{errors.typeunload}*</p>}
        </div>
        <div className="mb-3">
          <input type="text" name='preplaning' defaultValue={dataInfo.preplaning} className="form-control" required placeholder="Pre-plaining hh:mm:ss" onChange={handlerOnchange}/>
          {errors?.preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.preplaning}*</p>}
        </div>
        <div className="mb-3">
          <input type="number" min={1} max={16} name='ppl_unloaded' defaultValue={dataInfo.ppl_unloaded} className="form-control" required placeholder="PPL/Unloaded" onChange={handlerOnchange}/>
          {errors?.ppl_unloaded && <p className='text-center text-danger mx-1 mt-1' >*{errors.ppl_unloaded}*</p>}
        </div>
        <div className="mb-3">
          <input type="text"  name='unl_time' className="form-control" defaultValue={dataInfo.unl_time} required placeholder="UNL time" onChange={handlerOnchange}/>
          {errors?.unl_time && <p className='text-center text-danger mx-1 mt-1' >*{errors.unl_time}*</p>}
        </div>
        <div className="mb-3">
          <input type="text"  name='counted_hours' className="form-control" defaultValue={dataInfo.counted_hours} required placeholder="Counted Hours hh:mm:ss" onChange={handlerOnchange}/>
          {errors?.counted_hours && <p className='text-center text-danger mx-1 mt-1' >*{errors.counted_hours}*</p>}
        </div>
        <div className="mb-3">
          <input type="number" min={1} name='ppl_counted' className="form-control" defaultValue={dataInfo.ppl_counted} required placeholder="PPL Counted" onChange={handlerOnchange}/>
          {errors?.ppl_counted && <p className='text-center text-danger mx-1 mt-1' >*{errors.ppl_counted}*</p>}
        </div>
        <div className="mb-3">
          <input type="text"  name='stagung_pallets' className="form-control" defaultValue={dataInfo.stagung_pallets} required placeholder="Staging Pallets hh:mm:ss" onChange={handlerOnchange}/>
          {errors?.stagung_pallets && <p className='text-center text-danger mx-1 mt-1' >*{errors.stagung_pallets}*</p>}
        </div>
        <div className="mb-3">
          <input type="text"  name='forklift_time' className="form-control" defaultValue={dataInfo.forklift_time} required placeholder="Forklift Time hh:mm:ss" onChange={handlerOnchange}/>
          {errors?.forklift_time && <p className='text-center text-danger mx-1 mt-1' >*{errors.forklift_time}*</p>}
        </div>
        <div className="mb-3">
          <input type="number" min={1} name='ppl_forklift' defaultValue={dataInfo.ppl_forklift} className="form-control" required placeholder="PPL Forklift" onChange={handlerOnchange}/>
          {errors?.ppl_forklift && <p className='text-center text-danger mx-1 mt-1' >*{errors.ppl_forklift}*</p>}
        </div>
        <div className="mb-3">
          <input type="text"  name='qc_time' className="form-control" defaultValue={dataInfo.qc_time} required placeholder="QC Time hh:mm:ss" onChange={handlerOnchange}/>
          {errors?.qc_time && <p className='text-center text-danger mx-1 mt-1' >*{errors.qc_time}*</p>}
        </div>
        <div className="mb-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>Guardar</> }
            </button>
            <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/container/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>Cancelar</button>

        </div>
        </fieldset>
    </Form>
    </div>
    </div>
    )
}

