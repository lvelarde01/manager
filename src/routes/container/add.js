import React,{useContext,useState} from 'react'
import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp,hourList, minList} from '../../requests/users';
import {ActionFetch} from '../../requests/container';
import {schema_container} from '../../requests/rules'
import AlertMessage from '../../assets/alertmessage';
import InputCustom from  '../../assets/inputCustom';
import SelectCustom from '../../assets/selectCustom';


export async function loader({ request }) {
    const FetchWareHouse = ActionFetch({},'/api/warehouse/list');
    let resultFetch = await FetchWareHouse;
    const allWareHouse = {}
    for(let WareHouse in resultFetch ){
      allWareHouse[resultFetch[WareHouse]._id] =resultFetch[WareHouse].name; 
    }
    return {allWareHouse};
}
    
export function Add() {
  const {Auth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});
  const [defaultValues,setDefaultValues] = useState({});


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
    const result = await ActionFetch({...dataUserObj},'/api/container/add');
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se guardo correctamente.'});
        setLoading(false);
        setDefaultValues({});
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

const handlerDefaultValues =()=>{

  const data = Object.keys(schema_container).reduce((acc,current)=>{
    const value = schema_container[current].defaultValue;
    const clearOnregister = schema_container[current].clearOnregister; 
    if(clearOnregister){
      return  {...acc,[current]:value}
    }
  },{});
setDefaultValues(data);
}
const handlerClearValues = ()=>{
  setDefaultValues({});
}
const handlerOnchangeDefaulValue = (event)=>{
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;
 
   // if(value === defaultValues[name]) return;
    const {[name]:nameField_cp,...defaultValues_cp} = {...defaultValues};
    defaultValues_cp[name]=value;
    setDefaultValues(defaultValues_cp);
}

  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-2 block-radius-style'>
        <Form className='col-12 mt-3' method='post' onSubmit={handlerOnSubmit} >
      <fieldset>
        <div className="mb-1">
          <h2>REGISTRO DE CONTAINER</h2>
        </div>
        <legend>INFORMACION</legend>

        <div className='row'>
            <InputCustom  placeholderField={'NUMBER CONTAINER'} nameField={'name'} valueField={defaultValues?.name} onChange={handlerOnchangeDefaulValue} parentClassname={'col-3 mb-3'} errorsField={errors} setErrorField = {setErrors} />
            <InputCustom  placeholderField={'UNLOADING DATE MM/DD/YYYY'} typeField={'date'} nameField={'date_upload'} defaultValueField={defaultValues?.date_upload}  parentClassname={'col-3 mb-3'} errorsField={errors} setErrorField = {setErrors} />
            <SelectCustom placeholderField='BUILDING' nameField={'warehouse'} valueField={defaultValues?.warehouse} parentClassname={'col-3 mb-3'}  emptyOptionField={{key:'',value:"SELECT BUILDING"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={dataInfo?.allWareHouse} />
            <SelectCustom placeholderField='TYPE UNLOAD' nameField={'typeunload'} valueField={defaultValues?.typeunload}  emptyOptionField={{key:'',value:"SELECT TYPE UNLOAD"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={{'LIVE UNLOAD':'LIVE UNLOAD','DROP':'DROP'}} />

        </div>

        <div className='row'>

              <div className='col-6'>
                  <legend>PREPLANING</legend>
                  <InputCustom  placeholderField={'PPL/PREPLANING'} nameField={'ppl_preplaning'}  valueField={defaultValues?.ppl_preplaning} typeField="number" minField={1} maxField={16} onChange={handlerOnchangeDefaulValue} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                  <div className='row'>
                      <SelectCustom placeholderField='HOUR(s) PRE-PLANING' nameField={'preplaning_hour'} valueField={defaultValues?.preplaning_hour}  emptyOptionField={{key:'',value:"HOUR(s) PRE-PLANING"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={hourList({value:'',label:' HOUR(s)'})} />
                      <SelectCustom placeholderField='MINUTE(s) PRE-PLANING' nameField={'preplaning_min'} valueField={defaultValues?.preplaning_min}  emptyOptionField={{key:'',value:"MINUTE(s) PRE-PLANING"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={minList({value:'',label:' MINUTE(s) '})} />
                  </div>
              </div>

              <div className='col-6'>
                <legend>UNLOAD</legend>
                <InputCustom  placeholderField={'PPL/UNLOAD'} nameField={'ppl_unloaded'}  valueField={defaultValues?.ppl_unloaded} typeField="number" minField={1} maxField={16} onChange={handlerOnchangeDefaulValue} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                <div className='row'>
                    <SelectCustom placeholderField='HOUR(s) UNL TIME' nameField={'unltime_hour'} valueField={defaultValues?.preplaning_hour}  emptyOptionField={{key:'',value:"HOUR(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={hourList({value:'',label:' HOUR(s)'})} />
                    <SelectCustom placeholderField='MINUTE(s) UNL TIME' nameField={'unltime_min'} valueField={defaultValues?.preplaning_min}  emptyOptionField={{key:'',value:"MINUTE(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={minList({value:'',label:' MINUTE(s) '})} />
                </div>
              </div>

              <div className='col-6'>
                <legend>COUNTED</legend>
                <InputCustom  placeholderField={'PPL/COUNTED'} nameField={'ppl_counted'}  valueField={defaultValues?.ppl_counted} typeField="number" minField={1} maxField={16} onChange={handlerOnchangeDefaulValue} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                <div className='row'>
                    <SelectCustom placeholderField='HOUR(s) COUNTED' nameField={'counted_hours_hour'} valueField={defaultValues?.counted_hours_hour}  emptyOptionField={{key:'',value:"HOUR(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={hourList({value:'',label:' HOUR(s)'})} />
                    <SelectCustom placeholderField='MINUTE(s) COUNTED' nameField={'counted_hours_min'} valueField={defaultValues?.counted_hours_min}  emptyOptionField={{key:'',value:"MINUTE(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={minList({value:'',label:' MINUTE(s) '})} />
                </div>
              </div>
        
              <div className='col-6'>
                <legend>QC/PULL, COUNT AND REC.</legend>
                <InputCustom  placeholderField={'PPL/QC/PULL'} nameField={'ppl_qcpull'}  valueField={defaultValues?.ppl_qcpull} typeField="number" minField={1} maxField={16} onChange={handlerOnchangeDefaulValue} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                <div className='row'>
                    <SelectCustom placeholderField='HOUR(s) QC/PULL' nameField={'qcpull_hour'} valueField={defaultValues?.qcpull_hour}  emptyOptionField={{key:'',value:"HOUR(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={hourList({value:'',label:' HOUR(s)'})} />
                    <SelectCustom placeholderField='MINUTE(s) QC/PULL' nameField={'qcpull_min'} valueField={defaultValues?.qcpull_min}  emptyOptionField={{key:'',value:"MINUTE(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={minList({value:'',label:' MINUTE(s) '})} />
                </div>
              </div>

              <div className='col-6'>
                <legend>STAGING PALLETS</legend>
                <InputCustom  placeholderField={'PPL/STAGING PALLETS'} nameField={'ppl_forklift'}  valueField={defaultValues?.ppl_forklift} typeField="number" minField={1} maxField={16} onChange={handlerOnchangeDefaulValue} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                <div className='row'>
                    <SelectCustom placeholderField='HOUR(s) STAGING PALLETS' nameField={'staging_pallets_hour'} valueField={defaultValues?.staging_pallets_hour}  emptyOptionField={{key:'',value:"HOUR(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={hourList({value:'',label:' HOUR(s)'})} />
                    <SelectCustom placeholderField='MINUTE(s) STAGING PALLETS' nameField={'staging_pallets_min'} valueField={defaultValues?.staging_pallets_min}  emptyOptionField={{key:'',value:"MINUTE(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={minList({value:'',label:' MINUTE(s) '})} />
                </div>
              </div>

              <div className='col-6'>
                  <legend>VERIFY & EMAIL</legend>
                  <InputCustom  placeholderField={'PPL/VERIFY & EMAIL'} nameField={'ppl_verify_email'}  valueField={defaultValues?.ppl_verify_email} typeField="number" minField={1} maxField={16} onChange={handlerOnchangeDefaulValue} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                      <div className='row'>
                      <SelectCustom placeholderField='HOUR(s) VERIFY & EMAIL TIME' nameField={'verify_email_hour'} valueField={defaultValues?.staging_pallets_hour}  emptyOptionField={{key:'',value:"HOUR(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={hourList({value:'',label:' HOUR(s)'})} />
                      <SelectCustom placeholderField='MINUTE(s) VERIFY & EMAIL TIME' nameField={'verify_email_min'} valueField={defaultValues?.staging_pallets_min}  emptyOptionField={{key:'',value:"MINUTE(s) UNL TIME"}} onChange={handlerOnchangeDefaulValue} setErrorField={setErrors} errorsField={errors} optionsField={minList({value:'',label:' MINUTE(s) '})} />
                      </div>
                </div>
          </div>

        <div className='mb-3'>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>saving..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>Register</> }
            </button>
            <button type="button" className="btn btn-primary" disabled={loading} onClick={handlerDefaultValues} ><i className='fas fa-gear me-2'></i>Default Values</button>
            <button type="button" className="btn btn-primary" disabled={loading} onClick={handlerClearValues} ><i className='fas fa-trash me-2'></i>Clear Values</button>
          
          <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/container/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>Cancelar</button>
        </div>

      </fieldset>
    </Form>
    </div>
    </div>
  )
}
