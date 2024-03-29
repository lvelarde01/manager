import localforage from "localforage";
const checkDev = window._env_.REACT_APP_DEV || process.env.REACT_APP_DEV || false; 
const REMOTE_URL = window._env_.REACT_APP_URLAPI_REMOTE || process.env.REACT_APP_URLAPI_REMOTE || '/';
const LOCAL_URL = window._env_.REACT_APP_URLAPI || process.env.REACT_APP_URLAPI || '/';
export const URLAPI = (checkDev === 'true' ? LOCAL_URL : REMOTE_URL );
export const schema_password = {
  oldpassword:{
    rules:[
            {
              name:'onlyNumberAndLetterSimbols',
              message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
            },
            {
              name:'minLength',
              message:'Minimo de caracteres 5.',
              minLength:5,
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
              name:'minLength',
              message:'Minimo de caracteres 5.',
              minLength:5,
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
              name:'minLength',
              message:'Minimo de caracteres 5.',
              minLength:5,
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
                        name:'minLength',
                        message:'Minimo de caracteres 5 y maximo 10.',
                        minLength:5,
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
                        name:'minLength',
                        message:'Minimo de caracteres 5 y maximo 10.',
                        minLength:5,
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
export const listRex = async ({field,rule,value,matchField,matchFieldvalue,minLength=0,maxLength=0})=>{
  try {
    const error = {};
    let data = null;
    let Regex = null;
    let result = false;
      switch (rule) {
      case 'onlyNumberAndLetter': Regex = /^[a-zA-Z0-9]*$/;break;
      case 'onlyNumberAndLetterSimbols': Regex = /^[a-zA-Z0-9\_.-@*#]*$/;break;
      case 'onlyNumber': Regex = /^[0-9]*$/;break;
      case 'onlyLetters': Regex = /^[a-zA-Z]*$/;break;
      case 'onlyLettersSpaces': Regex = /^[a-zA-Z\s]*$/;break;
      case 'onlyNumberAndLetterSimbolsSpaces': Regex = /^[a-zA-Z0-9\_.-@*#\s]*$/;break;
      case 'email': Regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;break;
      case 'isUnique':  data = await checkIsUnique({field,value}); result=!!data.isunique; break;
      case 'compareField':  result = value === matchFieldvalue ? true : false; break;
      case 'minLength': result = value.length >= minLength ? true : false;  break;
      case 'maxLength':  result = value.length <= maxLength ? true : false;  break;
      case 'minMaxLength': result = value?.length >= minLength && value?.length <= maxLength  ? true : false;  break;
      default: error.message = `rule not register [${rule}]` ;break;
    }
    if(!Regex){
        data = result;
    }else{
      const regex_test = new RegExp(Regex,"g");
      data = regex_test.test(value);
      regex_test.lastIndex = 0;
    }
    return {error,data};
  } catch (error) {
    return {error:"Se presento un problema en la api [listRex]",data:null};
  }  
}
export const startUp = async ({data,schema,ignoreRules={},allowFields=[],denieFields=[]})=>{
  try{      
        let error={};
        const dataUserObj = {};
        
          for (const value of Object.entries(schema)) {
            if(allowFields.length > 1 && !allowFields.some((query) => query === value[0])){
              continue;
            } 
            for (const valueChildlren of value[1].rules) {
              const keyName=value[0];
              const ruleName = valueChildlren.name;
              const valueField = typeof data[value[0]] === 'string'? data[value[0]].trim() : data[value[0]] ;
              const matchField = valueChildlren.matchField || undefined;
              const matchFieldvalue = data[matchField] || undefined;
              const minLength = valueChildlren.minLength || undefined;
              const maxLength = valueChildlren.maxLength || undefined;
              const urlQuery = valueChildlren.urlQuery || undefined;

              let result = ignoreRules?.[keyName]?.rules?.some((valueScope)=>{
              console.log(valueScope[ruleName]); 

                return valueScope?.[ruleName] || false;
              }) || await listRex({field:keyName,rule:ruleName,value:valueField,matchField,matchFieldvalue,minLength,maxLength,urlQuery});
              if(result?.error?.message){
                error[keyName]=result?.error?.message;
              }else if(result === false || result?.data===false){
                error[keyName]=valueChildlren?.message;
              }else if(!valueChildlren?.ignoreFieldForsave){
                dataUserObj[keyName]=valueField;
              }
            }
        }
        return {error,dataUserObj};
      } catch (error) {
        return {error:"Se presento un problema en la api [startUp]",dataUserObj:{}}
      }
}
/*export const startUp = async ({data,schema})=>{
  try {
        let error={};
        const dataUserObj = {};
        for (const value of Object.entries(schema)) {
          for (const valueChildlren of value[1]?.rules) {
                const keyName=value[0];
                const ruleName = valueChildlren.name; 
                const valueField = data[value[0]];
                const matchField = valueChildlren.matchField || undefined;
                const matchFieldvalue = data[matchField] || undefined;
                const minLength = valueChildlren.minLength || undefined;
                const maxLength = valueChildlren.maxLength || undefined;
                const result = await listRex({field:keyName,rule:ruleName,value:valueField,matchField,matchFieldvalue,minLength,maxLength});
                if(result?.error?.message){
                  error[keyName]=result?.error?.message;
                }else if(!result?.data){
                  error[keyName]=valueChildlren?.message;
                }else if(!valueChildlren?.ignoreFieldForsave){
                  dataUserObj[keyName]=valueField;
                }
          }
        }
    return {error,dataUserObj};
  } catch (error) {
      return {error:"Se presento un problema en la api [startUp]",dataUserObj:{}}
  }
}*/
export async function checkIsUnique({field,value,infoUser=false}){
  const query = {[field]:value};
  const dataResponse = await fetch(`${URLAPI}/api/users/checkisunique`, {
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
export async function getloginAuthGoogle({client_id,credential,typeLoggin = "login"}){
  const dataUpdate = {client_id,credential,typeLoggin};
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