import localforage from "localforage";

export async function getlogin({username,password}){
    const dataUpdate = {username,password};

    const dataResponse = await fetch('https://manager-backend.lvelarde01.repl.co/api/users/login', {
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
export async function getinfoUser(){
    const {id,token} =  await localforage.getItem('user');
    const dataUpdate = {_id:id,token};

    const dataResponse = await fetch('https://manager-backend.lvelarde01.repl.co/api/users/info', {
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

    const dataResponse = await fetch('https://manager-backend.lvelarde01.repl.co/api/users/updateinfo', {
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
export async function clearUser(){
    return await localforage.removeItem('user');
}
function setLocal(dataUserObj){
  return  localforage.setItem('user', dataUserObj);

}