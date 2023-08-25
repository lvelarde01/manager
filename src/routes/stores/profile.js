import React from 'react'
import { ActionFetch } from '../../requests/utilsApis';


export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const result = await ActionFetch( {dataObj:{q},UrlFetch:'/api/stores/profile'})
    console.log(result);
    //const contacts = await getContacts(q);
      return {q};
    }

export function Profile() {
  return (
    <div>profile</div>
  )
}
