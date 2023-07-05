    import React,{useContext,useState} from 'react'
    import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
    import AuthContext from '../../context/auth-context';
    import {startUp} from '../../requests/users';
    import {ActionFetch} from '../../requests/container';
    import {schema_container} from '../../requests/rules'
    import AlertMessage from '../../assets/alertmessage';
    
    
    export async function loader({ params }) {
        const FetchContainer = ActionFetch({_id:params.id},'/api/container/getinfo');
        const FetchWareHouse = ActionFetch({},'/api/warehouse/list');
        let resultFetchContainer = await FetchContainer;
        let resultFetch = await FetchWareHouse;
        const allWareHouse = Object.values(resultFetch);
        console.log(allWareHouse);
        return {allWareHouse,resultFetchContainer};
    }
        
    export function Edit() {
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
        const result = await ActionFetch({...dataUserObj,_id:dataInfo?.resultFetchContainer?._id},'/api/container/edit');
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
    
    
    
    
    console.log(errors);
      return (
        <div className={`row justify-content-center ${Auth.theme}-style`} >
            {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
            <div className='row ms-3 mt-3 block-radius-style'>
            <Form className='col-12 mt-3' method='post' onSubmit={handlerOnSubmit} >
                <fieldset>
                  <div className="mb-3">
                    <h2>EDIT CONTAINER</h2>
                  </div>
                  <legend>INFORMATION</legend>
                  <div className='row'>
                      <div className="col-3 mb-3">
                        <input type="text" name='name' defaultValue={dataInfo?.resultFetchContainer?.name} className="form-control" required placeholder="NUMBER CONTAINER" onChange={handlerOnchange}/>
                        {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
                      </div>
                      <div className="col-3 mb-3">
                        <input type="date" name='date_upload' defaultValue={dataInfo?.resultFetchContainer?.date_upload} className="form-control" required placeholder="Unloading Date mm/dd/yyyy" onChange={handlerOnchange}/>
                        {errors?.date_upload && <p className='text-center text-danger mx-1 mt-1' >*{errors.date_upload}*</p>}
                      </div>
                      <div className="col-3 mb-3">
                        <select className="form-select" name='warehouse' defaultValue={dataInfo?.resultFetchContainer?.warehouse}  required onChange={handlerOnchange} >
                        <option value={null}>SELECIONA BUILDING</option>
                          {   dataInfo?.allWareHouse.map((data)=>(
                              <option key={data._id} value={data._id}>{data.name}</option>
                            ))
                          }
                        </select>
                        {errors?.warehouse && <p className='text-center text-danger mx-1 mt-1' >*{errors.warehouse}*</p>}
                      </div>
                      <div className="col-3 mb-3">
                        <select className="form-select" name='typeunload' defaultValue={dataInfo?.resultFetchContainer?.typeunload} required onChange={handlerOnchange} >
                            <option value={null}>TIPO DE DESCARGA</option>
                            <option value={"DROP"}>DROP</option>
                            <option value={"LIVE UNLOAD"}>LIVE UNLOAD</option>
                          </select>
                        {errors?.typeunload && <p className='text-center text-danger mx-1 mt-1' >*{errors.typeunload}*</p>}
                      </div>
                  </div>
                  <div className='row'>
                      <div className='col-6'>
                          <legend>PREPLANING</legend>
                          <div className="mb-3">
                            <input type="number" min={1} max={16} name='ppl_preplaning' className="form-control"  defaultValue={dataInfo?.resultFetchContainer?.ppl_preplaning}  required placeholder="PPL/PREPLANING" onChange={handlerOnchange}/>
                            {errors?.ppl_preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.ppl_preplaning}*</p>}
                          </div>
                          
                          <div className='row'>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='preplaning_hour' defaultValue={dataInfo?.resultFetchContainer?.preplaning_hour} required onChange={handlerOnchange} >
                                <option value={null}>HORAS PRE-PLANING</option>
                                {Hours.map((value)=>(
                                    <option key={value} value={value}>({value}) HORA(s) PRE-PLANING</option>
                                ))}
                                </select>
                                {errors?.preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.preplaning}*</p>}
                              </div>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='preplaning_min' defaultValue={dataInfo?.resultFetchContainer?.preplaning_min} required onChange={handlerOnchange} >
                                <option value={null}>MINUTOS PRE-PLANING</option>
                                {Min.map((value)=>(
                                    <option key={value} value={value}>({value}) MINUTOS PRE-PLANING</option>
                                ))}
                                </select>
                                {errors?.preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.preplaning}*</p>}
                              </div>
                          </div>
                      </div>

                      <div className='col-6'>
                          <legend>UNLOAD</legend>
                          <div className="mb-3">
                            <input type="number" min={1} max={16} name='ppl_unloaded' defaultValue={dataInfo?.resultFetchContainer?.ppl_unloaded}  className="form-control" required placeholder="PPL/Unloaded" onChange={handlerOnchange}/>
                            {errors?.ppl_unloaded && <p className='text-center text-danger mx-1 mt-1' >*{errors.ppl_unloaded}*</p>}
                          </div>
                          <div className='row'>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='unltime_hour' defaultValue={dataInfo?.resultFetchContainer?.unltime_hour} required onChange={handlerOnchange} >
                                <option value={null}>HORAS UNL TIME</option>
                                {Hours.map((value)=>(
                                    <option key={value} value={value}>({value}) HORA(s) UNL TIME</option>
                                ))}
                                </select>
                                {errors?.preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.preplaning}*</p>}
                              </div>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='unltime_min' defaultValue={dataInfo?.resultFetchContainer?.unltime_min} required onChange={handlerOnchange} >
                                <option value={null}>MINUTOS UNL TIME</option>
                                {Min.map((value)=>(
                                    <option key={value} value={value}>({value}) MINUTOS UNL TIME</option>
                                ))}
                                </select>
                                {errors?.preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.preplaning}*</p>}
                              </div>
                          </div>
                      </div>

                      <div className='col-6'>
                          <legend>COUNTED</legend>
                          <div className="mb-3">
                            <input type="number" min={1} name='ppl_counted' defaultValue={dataInfo?.resultFetchContainer?.ppl_counted} className="form-control" required placeholder="PPL Counted" onChange={handlerOnchange}/>
                            {errors?.ppl_counted && <p className='text-center text-danger mx-1 mt-1' >*{errors.ppl_counted}*</p>}
                          </div>
                          <div className='row'>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='counted_hours_hour' defaultValue={dataInfo?.resultFetchContainer?.counted_hours_hour} required onChange={handlerOnchange} >
                                <option value={null}>HORAS COUNTED HOURS</option>
                                {Hours.map((value)=>(
                                    <option key={value} value={value}>({value}) HORA(s) COUNTED HOURS</option>
                                ))}
                                </select>
                                {errors?.preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.preplaning}*</p>}
                              </div>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='counted_hours_min' defaultValue={dataInfo?.resultFetchContainer?.counted_hours_min} required onChange={handlerOnchange} >
                                <option value={null}>MINUTOS COUNTED HOURS</option>
                                {Min.map((value)=>(
                                    <option key={value} value={value}>({value}) MINUTOS COUNTED HOURS</option>
                                ))}
                                </select>
                                {errors?.preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.preplaning}*</p>}
                              </div>
                          </div>
                      </div>
                      
                      <div className='col-6'>
                      <legend>QC/PULL, COUNT AND REC.</legend>
                      <div className="mb-3">
                        <input type="number" min={1} name='ppl_qcpull' defaultValue={dataInfo?.resultFetchContainer?.ppl_qcpull} className="form-control" required placeholder="PPL/QC/PULL" onChange={handlerOnchange}/>
                        {errors?.ppl_qcpull && <p className='text-center text-danger mx-1 mt-1' >*{errors.ppl_qcpull}*</p>}
                      </div>
                      <div className='row'>
                          <div className="col-6 mb-3">
                          <select className="form-select" name='qcpull_hour' defaultValue={dataInfo?.resultFetchContainer?.qcpull_hour} required onChange={handlerOnchange} >
                            <option value={null}>HOURS QC/PULL</option>
                            {Hours.map((value)=>(
                                <option key={value} value={value}>({value}) HOUR(s) QC/PULL</option>
                            ))}
                            </select>
                            {errors?.qcpull_hour && <p className='text-center text-danger mx-1 mt-1' >*{errors.qcpull_hour}*</p>}
                          </div>
                          <div className="col-6 mb-3">
                          <select className="form-select" name='qcpull_min' defaultValue={dataInfo?.resultFetchContainer?.qcpull_min} required onChange={handlerOnchange} >
                            <option value={null}>MINUTES QC/PULL</option>
                            {Min.map((value)=>(
                                <option key={value} value={value}>({value}) MINUTE(s) QC/PULL</option>
                            ))}
                            </select>
                            {errors?.qcpull_min && <p className='text-center text-danger mx-1 mt-1' >*{errors.qcpull_min}*</p>}
                          </div>
                      </div>
                      </div>

                      <div className='col-6'>
                          <legend>STAGING PALLETS</legend>
                          <div className="mb-3">
                            <input type="number" min={1} name='ppl_forklift' defaultValue={dataInfo?.resultFetchContainer?.ppl_forklift} className="form-control" required placeholder="PPL/STAGING PALLETS" onChange={handlerOnchange}/>
                            {errors?.ppl_forklift && <p className='text-center text-danger mx-1 mt-1' >*{errors.ppl_forklift}*</p>}
                          </div>
                          <div className='row'>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='staging_pallets_hour' defaultValue={dataInfo?.resultFetchContainer?.staging_pallets_hour} required onChange={handlerOnchange} >
                                <option value={null}>HORAS STAGING PALLETS</option>
                                {Hours.map((value)=>(
                                    <option key={value} value={value}>({value}) HORA(s) STAGING PALLETS</option>
                                ))}
                                </select>
                                {errors?.preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.preplaning}*</p>}
                              </div>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='staging_pallets_min' defaultValue={dataInfo?.resultFetchContainer?.staging_pallets_min} required onChange={handlerOnchange} >
                                <option value={null}>MINUTOS STAGING PALLETS</option>
                                {Min.map((value)=>(
                                    <option key={value} value={value}>({value}) MINUTOS STAGING PALLETS</option>
                                ))}
                                </select>
                                {errors?.preplaning && <p className='text-center text-danger mx-1 mt-1' >*{errors.preplaning}*</p>}
                              </div>
                          </div>
                      </div>
                      
                      <div className='col-6'>
                          <legend>VERIFY & EMAIL</legend>
                          <div className="mb-3">
                            <input type="number" min={1} name='ppl_verify_email' defaultValue={dataInfo?.resultFetchContainer?.ppl_verify_email} className="form-control" required placeholder="PPL/VERIFY & EMAIL" onChange={handlerOnchange}/>
                            {errors?.ppl_verify_email && <p className='text-center text-danger mx-1 mt-1' >*{errors.ppl_verify_email}*</p>}
                          </div>
                          <div className='row'>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='verify_email_hour' defaultValue={dataInfo?.resultFetchContainer?.verify_email_hour} required onChange={handlerOnchange} >
                                <option value={null}>HOUR(s) VERIFY & EMAIL TIME</option>
                                {Hours.map((value)=>(
                                    <option key={value} value={value}>({value}) HOUR(s) VERIFY & EMAIL TIME</option>
                                ))}
                                </select>
                                {errors?.verify_email_hour && <p className='text-center text-danger mx-1 mt-1' >*{errors.verify_email_hour}*</p>}
                              </div>
                              <div className="col-6 mb-3">
                              <select className="form-select" name='verify_email_min' defaultValue={dataInfo?.resultFetchContainer?.verify_email_min} required onChange={handlerOnchange} >
                                <option value={null}>MINUTE(s) VERIFY & EMAIL TIME</option>
                                {Min.map((value)=>(
                                    <option key={value} value={value}>({value}) MINUTE(s) VERIFY & EMAIL TIME</option>
                                ))}
                                </select>
                                {errors?.verify_email_min && <p className='text-center text-danger mx-1 mt-1' >*{errors.verify_email_min}*</p>}
                              </div>
                          </div>
                      </div>

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
    