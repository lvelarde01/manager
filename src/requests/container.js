import { URLAPI } from "./users";

export async function ActionFetch(dataWarehouseObj,UrlFetch){
    const dataResponse = await fetch(`${URLAPI}${UrlFetch}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataWarehouseObj)
      }).then(response =>response.json()).catch((error)=>{
        console.warn(error);
        return {error:'Error de Respuesta'}
      });
    return dataResponse;
  }