import React,{useContext,useEffect,useState} from 'react'
import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp,FixHours} from '../../requests/users';
import {ActionFetch} from '../../requests/container';
import {schema_calendars} from '../../requests/rules'
import AlertMessage from '../../assets/alertmessage';

export async function loader({ request }) {
    const FetchWorkers = ActionFetch({},'/api/workers/list');
    const FetchDepartments = ActionFetch({},'/api/departments/list');

    let resultFetch = await FetchWorkers;
    let resultFetchDepartments = await FetchDepartments;

    const allWorkers = Object.values(resultFetch);
    const allDepartmens = Object.values(resultFetchDepartments);
    const defaultDate = new Date();
    const currentDate = `${defaultDate.getFullYear()}-${ String((defaultDate.getUTCMonth()+1) || 0).padStart(2,'0')}-${defaultDate.getUTCDate()}`;
    return {allWorkers,allDepartmens,currentDate};
}
    
export function Add() {
  const {Auth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});
  const dataInfo = useLoaderData();
  const navigate = useNavigate();
  const Min = [];
  const Hours = [];
  for (let index = 0; index <= 60; index++) {
     Min.push(String(index).padStart(2,'0'));
  }
  for (let index = 0; index <= 23; index++) {
    Hours.push(String(index).padStart(2,'0'));
 }


  const handlerOnchange = (event)=>{
    const nameField = event.currentTarget.name;
    console.warn(event.currentTarget.value)
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

    const {error,dataUserObj} = await startUp({data,schema:schema_calendars,ignoreRules:{worker_finish_hour:{rules:[{'onlyNumber':true},{'minMaxLength':true}]},worker_finish_min:{rules:[{'onlyNumber':true},{'minMaxLength':true}]}}});
    console.log(error);
    console.log(dataUserObj);
    
    if(Object.entries(error).length > 0){
        setTimeout(()=>{
          setFetchReady({ready:true,msgtype:'danger',message:''});
          setErrors({...error});
          setLoading(false);
        },3000);
        return;
    }
    
    console.log("NO ERRORS");
    const result = await ActionFetch({...dataUserObj},'/api/calendars/add');
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se guardo correctamente.'});
        setLoading(false);
        event.target.name.value = '';
        event.target.name.value = '';

        
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
        <h2>REGISTER CONTROL WORKER</h2>
      </div>
        <legend>INFORMACION</legend>
        <div className="mb-3">
        <select className="form-select" name='worker_id' required onChange={handlerOnchange} >
          <option value={null}>SELECT WORKER</option>
          {dataInfo.allWorkers.map((value)=>(
            <option key={value._id} value={value._id}>{value.name}</option>
          ))}
          </select>
          {errors?.worker_id && <p className='text-center text-danger mx-1 mt-1' >*{errors.worker_id}*</p>}
        </div>
        <div className="mb-3">
        <select className="form-select" name='department_id' required onChange={handlerOnchange} >
          <option value={null}>SELECT DEPARTMENT</option>
          {dataInfo.allDepartmens.map((value)=>(
            <option key={value._id} value={value._id}>{value.name}</option>
          ))}
          </select>
          {errors?.department_id && <p className='text-center text-danger mx-1 mt-1' >*{errors.department_id}*</p>}
        </div>
        <div className="mb-3">
          <input type="date"  name='date_register' defaultValue={dataInfo.currentDate} className="form-control" required placeholder="VPS-#" onChange={handlerOnchange}/>
          {errors?.date_register && <p className='text-center text-danger mx-1 mt-1' >*{errors.date_register}*</p>}
        </div>
        <div className='row'>
            <div className="col-6 mb-3">
            <select className="form-select" name='worker_start_hour' required onChange={handlerOnchange} >
              <option value={null}>HOURS START WORKER</option>
              {Hours.map((value)=>(
                  <option key={value} value={value}>({FixHours(value,0,true)}) HOUR(s) START WORKER</option>
              ))}
              </select>
              {errors?.worker_start_hour && <p className='text-center text-danger mx-1 mt-1' >*{errors.worker_start_hour}*</p>}
            </div>
            <div className="col-6 mb-3">
            <select className="form-select" name='worker_start_min' required onChange={handlerOnchange} >
              <option value={null}>MINUTES START WORKER</option>
              {Min.map((value)=>(
                  <option key={value} value={value}>({value}) MINUTE(s) START WORKER</option>
              ))}
              </select>
              {errors?.worker_start_min && <p className='text-center text-danger mx-1 mt-1' >*{errors.worker_start_min}*</p>}
            </div>
        </div>
        <div className="mb-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>Registrar</> }
            </button>
          <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/calendars/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>Cancelar</button>
        </div>
      </fieldset>
    </Form>
    </div>
    </div>
  )
}
