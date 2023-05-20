import React,{useEffect, useState,useId} from 'react'

export default function SelectCustom({
  placeholderField='',
  nameField='' ,
  optionsField = {},
  errorsField = {},
  setErrorField,
  parentClassname = 'col mb-3 mx-0',
  classNameField='form-select',
  onChange,
  valueField="",
  customValues,
  customLabels,
  emptyOptionField = {value:'SELECCIONE',key:''},
  required
}) {
    const [inputValue,setInputValue] = useState('');
    const [inputValueCurrent,setInputValueCurrent] = useState(null);
    const [inputValueChangeCurrent,setInputValueChangeCurrent] = useState(null);


    const [inputOptions,setInputOptions] = useState({});

    const labelSelectid = useId();

    const handlerOnchange = React.useCallback((event)=>{
      const value = event?.currentTarget?.value || '';
      const nameField = event?.currentTarget?.name; 

        if(typeof onChange === "function"){
          console.log("onchange function");
          onChange(event);
        }else{
          setInputValue(value);
        }
        if(typeof setErrorField !== 'function' || !nameField) return;
        const {[nameField]:cpNameField,...cpErrors} = {...errorsField};
        if(cpNameField){ 
            setErrorField({...cpErrors});
        }
    },[setErrorField,errorsField,onChange,inputValue]);

    const getValueCustom = React.useCallback(()=>{
        

        if(Object.keys(inputOptions).length > 0 || Object.keys(optionsField).length === 0 ) return;
        console.log("run callback",Object.keys(inputOptions).length );
        console.log(inputOptions); 
       const inputOptionsCustom = Object.keys(optionsField).sort().map((indexKey)=>{
        const value = typeof customLabels === "function" ? customLabels({key:indexKey,value:optionsField[indexKey]}) : optionsField[indexKey];
        const key = typeof customValues === "function" ? customValues({key:indexKey,value:optionsField[indexKey]}): indexKey;
            return {key,value};
        });
        setInputOptions(inputOptionsCustom);
    },[inputOptions,setInputOptions,customValues,customLabels,optionsField])

    useEffect(()=>{
      getValueCustom();
    },[getValueCustom])
    useEffect(()=>{
      console.log("change ValueField");
      console.log({valueField});




      /*if(!inputValueCurrent && valueField){
        console.log("set Value");
        setInputValue(valueField);
        setInputValueCurrent(valueField);
      }else if(inputValueCurrent && (valueField ==='' || valueField===null || valueField === undefined ) ){
        console.log("Clear Value");
        setInputValue('');
        setInputValueCurrent(null);
      }*/
      setInputValue(valueField);

    },[valueField,setInputValue]);

    

  return (
        <div className={parentClassname}>
          <label htmlFor={labelSelectid} style={{fontSize:'11px',color:'blue',fontWeight:'bold'}}>{inputValue&&placeholderField} {errorsField?.[nameField] &&<strong style={{color:'#dc3545'}}>*</strong>}</label>
        <select id={labelSelectid} style={{padding:'0px'}} name={nameField}  value={inputValue} className={classNameField} required onChange={handlerOnchange}>
          <option value={emptyOptionField.key}>{emptyOptionField.value}</option>
          {Object.keys(inputOptions).map((key)=>(
            <option key={inputOptions[key].key} value={inputOptions[key].key}>{inputOptions[key].value}</option>
          ))}
          </select>
          {errorsField?.[nameField] && <div style={{padding:'1px',border:'2px solid #dc3545',borderRadius:'8px'}} className='text-danger mt-1 text-center' >{errorsField?.[nameField]}</div>}
        </div>
  )
}
