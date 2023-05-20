import React,{useEffect, useState} from 'react'

export default function InputCustom({
  placeholderField='',
  nameField='',
  valueField='',
  defaultValueField,
  typeField = 'text',
  errorsField = {},
  setErrorField,
  parentClassname = 'col mb-3 ms-2 mx-0',
  classNameField='form-control',
  minField,
  maxField,
  onChange,
  required
}) {
    const [inputValue,setInputValue] = useState('');
    const handlerOnchange = (event)=>{
        const value = event.currentTarget.value;
        if(typeof onChange === "function"){
          console.log("onchange function");
          onChange(event);
        }else{
        setInputValue(value);
      }
        if(typeof setErrorField !== 'function') return;
        const nameField = event.currentTarget.name; 
        const {[nameField]:cpNameField,...cpErrors} = {...errorsField};
        if(cpNameField){ 
            setErrorField({...cpErrors});
        }
    }
    useEffect(()=>{
      setInputValue(valueField)
    },[valueField,setInputValue]);
  return (
        <div className={parentClassname}>
          <label style={{fontSize:'11px',color:'blue',fontWeight:'bold'}}>{inputValue&&placeholderField} {errorsField?.[nameField] &&<strong style={{color:'#dc3545'}}>*</strong>}</label>
          <input type={typeField} value={inputValue} style={{padding:'0px'}} name={nameField} min={minField} max={maxField} className={classNameField} placeholder={placeholderField} required onChange={handlerOnchange} />
          {errorsField?.[nameField] && <div style={{padding:'1px',border:'2px solid #dc3545',borderRadius:'8px'}} className='text-danger mt-1 text-center' >{errorsField?.[nameField]}</div>}
        </div>
  )
}
