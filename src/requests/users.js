import localforage from "localforage";
const checkDev = window._env_.REACT_APP_DEV || process.env.REACT_APP_DEV || false; 
const REMOTE_URL = window._env_.REACT_APP_URLAPI_REMOTE || process.env.REACT_APP_URLAPI_REMOTE || '/';
const LOCAL_URL = window._env_.REACT_APP_URLAPI || process.env.REACT_APP_URLAPI || '/';
export const URLAPI = (checkDev === 'true' ? LOCAL_URL : REMOTE_URL );
export const schema_password = {
  password:{
    rules:[
            {
              name:'onlyNumberAndLetterSimbols',
              message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
            },
            {
              name:'compareField',
              matchField:'repeatpassword',
              message:'No Coincide la contrasena.'
            },
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:5,
              maxLength:10,
            },
          ]
  },
repeatpassword:{  
    rules:[
            {
              name:'onlyNumberAndLetterSimbols',
              message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
            },
            {
              name:'compareField',
              matchField:'password',
              message:'No Coincide la contrasena.'
            },
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:5,
              maxLength:10,
            },
          ],
          ignoreFieldForsave:true,
      },
}
export const schema_recovery = {
  email:{  
      rules:[
              {
                name:'email',
                message:'ingrese un correo electronico valido'
              },
              {
                name:'minMaxLength',
                message:'Minimo de caracteres 5 y maximo 50.',
                minLength:5,
                maxLength:50,
              },
            ]
  },
}
export const schema_login = {
  username:{
              rules:[
                      {
                        name:'onlyNumberAndLetter',
                        message:'Solo permitido letras y numeros.'
                      },
                      {
                        name:'minMaxLength',
                        message:'Minimo de caracteres 5 y maximo 10.',
                        minLength:5,
                        maxLength:10,
                      },
                    ]
            },
  password:{
              rules:[
                      {
                        name:'onlyNumberAndLetterSimbols',
                        message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                      },
                      {
                        name:'minMaxLength',
                        message:'Minimo de caracteres 5 y maximo 10.',
                        minLength:5,
                        maxLength:10,
                      },
                    ]
            },
}
export const schema = {
  username:{
              rules:[
                      {
                        name:'onlyNumberAndLetter',
                        message:'Solo permitido letras y numeros.'
                      },
                      {
                        name:'isUnique',
                        message:'Usuario ya Registrado.'
                      },
                    ]
            },
  password:{
              rules:[
                      {
                        name:'onlyNumberAndLetterSimbols',
                        message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                      },
                      {
                        name:'compareField',
                        matchField:'repeatpassword',
                        message:'No Coincide la contrasena.'
                      },
                      {
                        name:'minMaxLength',
                        message:'Minimo de caracteres 5 y maximo 10.',
                        minLength:5,
                        maxLength:10,
                      },
                    ]
            },
  repeatpassword:{  
              rules:[
                      {
                        name:'onlyNumberAndLetterSimbols',
                        message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                      },
                      {
                        name:'compareField',
                        matchField:'password',
                        message:'No Coincide la contrasena.'
                      },
                      {
                        name:'minMaxLength',
                        message:'Minimo de caracteres 5 y maximo 10.',
                        minLength:5,
                        maxLength:10,
                      },
                    ],
                    ignoreFieldForsave:true,
                },
  company:{  
          rules:[
                  {
                    name:'onlyNumberAndLetterSimbolsSpaces',
                    message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                  },
                ]
          },
  company_ssid:{  
                  rules:[
                          {
                            name:'onlyNumber',
                            message:'Solo se Permiten Numeros'
                          },
                        ]
                },
  role:{  
          rules:[
                  {
                    name:'onlyLetters',
                    message:'Seleccione el valor correcto.'
                  },
                ]
        },
  firstname:{  
              rules:[
                      {
                        name:'onlyLettersSpaces',
                        message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                      },
                    ]
            },
  lastname:{  
              rules:[
                      {
                        name:'onlyLettersSpaces',
                        message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                      },
                    ]
            },
  email:{  
              rules:[
                      {
                        name:'email',
                        message:'ingrese un correo electronico valido'
                      },
                      {
                        name:'isUnique',
                        message:'Correo Electronico ya registrado.'
                      },
                    ]
        },
}
export const listRex = async ({field,rule,value,matchField,matchFieldvalue,minLength=0,maxLength=0,urlQuery})=>{
 let Regex = null;
 let checkSpecial = false;
 let result = false;
  switch (rule) {
  case 'onlyNumberAndLetter': Regex = /^[a-zA-Z0-9]*$/;break;
  case 'onlyNumberAndLetterSimbols': Regex = /^[a-zA-Z0-9\_.-@*#]*$/;break;
  case 'onlyNumber': Regex = /^[0-9]*$/;break;
  case 'onlyLetters': Regex = /^[a-zA-Z]*$/;break;
  case 'onlyLettersSpaces': Regex = /^[a-zA-Z\s]*$/;break;
  case 'onlyNumberAndLetterSimbolsSpaces': Regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(\s+=._-]*$/;break;
  case 'email': Regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;break;
  case 'isUnique': checkSpecial=true;  Regex = await checkIsUnique({field,value,urlQuery}); result=!!Regex.isunique; break;
  case 'compareField': checkSpecial=true;  result = value === matchFieldvalue ? true : false; break;
  case 'minLength': checkSpecial=true; result = value.length >= minLength ? true : false;  break;
  case 'maxLength': checkSpecial=true; result = value.length <= maxLength ? true : false;  break;
  case 'minMaxLength': checkSpecial=true; result = value?.length >= minLength && value?.length <= maxLength  ? true : false;  break;


 }
if(checkSpecial){
  return result;
}else{
 const regex_test = new RegExp(Regex,"g");
 return regex_test.test(value);
}
}
export const getCountContainer = (dataRow)=>{

  return dataRow.reduce((acc,current)=>{
    let PCSCurrent = 0;
    let countDROPCurrent = current.typeunload === 'DROP'? 1 : 0; 
    let countLIVECurrent = current.typeunload === 'LIVE UNLOAD'? 1 : 0; 
    const VpsCurrent = (acc.VPS || 0) + (current.vps.length || 0);
    
    countDROPCurrent = countDROPCurrent + Number(acc.countDROP || 0);
    countLIVECurrent = countLIVECurrent + Number(acc.countLIVE || 0);

    current.vps.forEach(element => {
      PCSCurrent = PCSCurrent + Number(element.pcs);
    });
    PCSCurrent = PCSCurrent + (acc.PCS || 0);
    
    return {
      PCS:PCSCurrent,
      VPS:VpsCurrent,
      countDROP: countDROPCurrent,
      countLIVE:countLIVECurrent
    }
  },{});
}
export const getPPL = (dataRow,ppl_field)=>{
  return dataRow.reduce((acc,current)=>{
  return (Number(current[ppl_field]) || 0) + (acc || 0);
  },0);
}
export const getTimeCount = (dataRow,filedHour,FieldMin)=>{

  const count = dataRow.reduce((acc,current)=>{
  let hourCurrent = Number(current[filedHour]) + (acc.countH || 0);
  let minCurrent = Number(current[FieldMin]) + (acc.countM || 0);
    return {  
      countH:hourCurrent,
      countM:minCurrent
    };
    },{});

  while (count.countM >= 60) {
    count.countM=count.countM - 60;
    count.countH=count.countH + 1;
  }
  return {...count};
}
export const formatNumber = (num, decimals) => num.toLocaleString('en-US', {
  minimumFractionDigits: 2,      
  maximumFractionDigits: 2,
});
export const hourList = ({label,value})=>{
  const Hour = {};
  for (let index = 0; index <= 23; index++) {
    Hour[`${String(index).padStart(2,'0')}${value}`] = `${String(index).padStart(2,'0')}${label}`;
 }
return Hour;
}
export const minList = ({label='',value=''})=>{
  const Min = {};
  for (let index = 0; index <= 60; index++) {
    Min[`${String(index).padStart(2,'0')}${value}`]=`${String(index).padStart(2,'0')}${label}`;
 }
return Min;
}
export const FixHours = (hour,minute,onlyHour = false)=>{
  let fix_hour = Number(hour) >= 13 ? Number(hour) -12 : hour;
   fix_hour = Number(hour) === 0 ? Number(hour) + 12 : fix_hour;
  let meridiano = Number(hour) >= 13  && Number(hour) <= 23 ? 'PM': 'AM';
  meridiano = Number(hour) === 12 ? 'M' : meridiano;
  if(onlyHour){
    return `${fix_hour} ${meridiano}`;
  }
  return ` ${String(fix_hour || 0).padStart(2,'0')}:${String(minute || 0).padStart(2,'0')} ${meridiano}`
}
export const FixTime = (hour,minute)=>{
  return `${String(hour || 0).padStart(2,'0') || 0 }:${ String(minute || 0).padStart(2,'0') || 0 }` 
}
export const PPLAverage = (PPL,AllRows)=>{
  return Math.round(Number(PPL) / Number(AllRows)) || 0 ;
}
export const TimeToNumber = (hour,min)=>{
  return ((min / 60) + hour) || 0;
}
export const resumeTimeAverage = (hour,min,PPL,AllRows,FixNumber=true)=>{
  if(!FixNumber) return (TimeToNumber(hour,min) * PPLAverage(PPL,AllRows)) || 0 ;  
  return formatNumber((TimeToNumber(hour,min) * PPLAverage(PPL,AllRows))) || 0 ;  
}
export const CountHours = (hourStart,minStart,hourFinish,minFinish,ObjResult=false)=>{
  let countMins=0;
  let countHours=0;
  let currentTimeInit = hourStart;
  if(hourFinish<hourStart){
    return 'hora incorrecta';
  }
  while (hourFinish>currentTimeInit) {
    countHours=countHours+1;
    currentTimeInit++;
  }
  if(minStart>minFinish){
    countMins=minFinish-minStart;   
  }else if(minStart<minFinish){
    countMins=minFinish-minStart;   
  }
  if(countMins<0){
    countMins=60+countMins;
    countHours=countHours > 0 ? countHours-1: 0;  
  }
  if(ObjResult){
    return {countH:countHours,countM:countMins};
  }
  return `${String(countHours || 0).padStart(2,'0')}:${String(countMins || 0).padStart(2,'0')}`;
}
export const startUp = async ({data,schema,ignoreRules={}})=>{
  let error={};
  const dataUserObj = {};
    for (const value of Object.entries(schema)) {
      for (const valueChildlren of value[1].rules) {
        const keyName=value[0];
        const ruleName = valueChildlren.name;
        const valueField = typeof data[value[0]] === 'string'? data[value[0]].trim() : data[value[0]] ;
        const matchField = valueChildlren.matchField || undefined;
        const matchFieldvalue = data[matchField] || undefined;
        const minLength = valueChildlren.minLength || undefined;
        const maxLength = valueChildlren.maxLength || undefined;
        const urlQuery = valueChildlren.urlQuery || undefined;
        console.log(urlQuery); 

        let result = ignoreRules?.[keyName]?.rules?.some((valueScope)=>{
          return valueScope?.[ruleName] || false;
        }) || await listRex({field:keyName,rule:ruleName,value:valueField,matchField,matchFieldvalue,minLength,maxLength,urlQuery});
        if(!result){
          error[keyName]=valueChildlren.message;
        }else if(!valueChildlren.ignoreFieldForsave){
          dataUserObj[keyName]=valueField;
        }
      }
  }
  return {error,dataUserObj};
}
export async function checkIsUnique({field,value,infoUser=false,urlQuery='/api/users/checkisunique'}){
  const query = {[field]:value};
  const dataResponse = await fetch(`${URLAPI}${urlQuery}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query)
  }).then(response =>response.json()).then((data)=>{
    return {...data};
  });
return dataResponse;

}
export async function getloginAuthGoogle({client_id,credential}){
  const dataUpdate = {client_id,credential};

  const dataResponse = await fetch(`${URLAPI}/api/users/logingoogle`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataUpdate)
  }).then(response =>response.json()).then((data)=>{
    const dataSendObj = {...data};
    if(dataSendObj.errors !== undefined){
        return {validate:false,...dataSendObj.errors};
    }
    setLocal(dataSendObj);
    return {validate:true,...dataSendObj};
  });
return dataResponse;

} 
export async function getlogin({username,password}){
    const dataUpdate = {username,password};

    const dataResponse = await fetch(`${URLAPI}/api/users/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUpdate)
      }).then(response =>response.json()).then((data)=>{
        const dataSendObj = {...data};
        if(dataSendObj.errors !== undefined){
            return {validate:false,...dataSendObj.errors};
        }
        setLocal(dataSendObj);
        return {validate:true,...dataSendObj};
      });
    return dataResponse;
}
export async function checkTokenPassword(dataUserObj){
  const dataResponse = await fetch(`${URLAPI}/api/users/checktoken`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataUserObj)
  }).then(response =>response.json());
return dataResponse;
}
export async function newPassword(dataUserObj){
  const dataResponse = await fetch(`${URLAPI}/api/users/newpassword`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataUserObj)
  }).then(response =>response.json());
return dataResponse;
}
export async function recoveryPassword(dataUserObj){
  const dataResponse = await fetch(`${URLAPI}/api/users/recoverypassword`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataUserObj)
  }).then(response =>response.json());
return dataResponse;
}
export async function newUser(dataUserObj){
    const dataResponse = await fetch(`${URLAPI}/api/users/add`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUserObj)
      }).then(response =>response.json());
    return dataResponse;

}
export async function newWarehouse(dataWarehouseObj){
  const dataResponse = await fetch(`${URLAPI}/api/warehouse/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataWarehouseObj)
    }).then(response =>response.json());
  return dataResponse;

}
export async function getAllWarehouse(dataWarehouseObj){
  const dataResponse = await fetch(`${URLAPI}/api/warehouse/list`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataWarehouseObj)
    }).then(response =>response.json());
  return dataResponse;

}
export async function GetinfoWarehouse(dataWarehouseObj){
  const dataResponse = await fetch(`${URLAPI}/api/warehouse/getinfo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataWarehouseObj)
    }).then(response =>response.json());
  return dataResponse;

}
export async function UpdateinfoWarehouse(dataWarehouseObj){
  const dataResponse = await fetch(`${URLAPI}/api/warehouse/edit`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataWarehouseObj)
    }).then(response =>response.json());
  return dataResponse;

}


export async function TrashWarehouse(dataWarehouseObj){
  const dataResponse = await fetch(`${URLAPI}/api/warehouse/trash`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataWarehouseObj)
    }).then(response =>response.json());
  return dataResponse;

}
export async function TrashAllWarehouse(dataWarehouseObj){
  const dataResponse = await fetch(`${URLAPI}/api/warehouse/trashall`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataWarehouseObj)
    }).then(response =>response.json());
  return dataResponse;

}

export async function getinfoUser(){
    const {id,token} =  await localforage.getItem('user');
    const dataUpdate = {_id:id,token};

    const dataResponse = await fetch(`${URLAPI}/api/users/info`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUpdate)
      }).then(response =>response.json());
    return dataResponse;
}
export async function updateinfoUser(dataUserObj){
    const {id,token} =  await localforage.getItem('user');
    const dataUpdate = {query:{_id:id,token},data:{...dataUserObj}};

    const dataResponse = await fetch(`${URLAPI}/api/users/updateinfo`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUpdate)
      }).then(response =>response.json());
    return dataResponse;
}
export async function validateLogin({username,password}){

    const errors = {validate:false};

    // validate the fields
    if (typeof username !== "string" || username.length < 6) {
        errors.username = "Ingrese los caracteres validos";
    }

    if (typeof password !== "string" || password.length < 6) {
        errors.password = "Debe Ingresar el minimo de Caracteres";
    }

    // return data if we have errors
    if (Object.keys(errors).length > 1) {
        errors.validate=true;
        return errors;
    }
    return errors;
}
export async function checkLogin(){
    const dataUserObj =  await localforage.getItem('user'); 
    if(dataUserObj===null){
        return {token:false};
    }
    console.log("Check Login user.js");
    return dataUserObj;
}
export async function getBase64(file, onLoadCallback) {
  return await new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
  });
}
export async function clearUser(){
    const dataUserObj =  await localforage.getItem('user'); 
    if(dataUserObj?.saveConfigBrowser === true ){
      return await setLocal({theme:dataUserObj.theme,token:false});
    }
    return await localforage.removeItem('user');
}
export async function setLocal(dataUserObj){
  return await localforage.setItem('user', dataUserObj);

}