import React,{useContext} from 'react'
import {Link,useLoaderData} from 'react-router-dom';
import ThemeContext,{themes} from '../../context/theme-context'
import AuthContext from '../../context/auth-context'
import TableCustom2 from '../../assets/tableCustom2';
import TableCustom from '../../assets/tableCustom';
import { ActionFetch } from '../../requests/utilsApis';
export async function loader({request}){
  const result = await ActionFetch( {dataObj:{},UrlFetch:'/api/users/list'});
  console.error(result);
  return {result};
}
export function Index() {
  const {Auth,handlerAuth} = useContext(AuthContext);
  const dataInfo = useLoaderData();
  console.warn(dataInfo.result);
  const columm = [
    {'label':'id','field':'_id','hide':true},
    {'label':'Rol','field':'role','hide':false},

    {'label':'Usuario','field':'username'},
    {'label':'Email','field':'email','hide':false},
  ];
  const rows = [];
  for (let index = 0; index <= 100; index++) {
    rows.push({'id':index,'username':`velarde${index}`,'email':`velarde${index}@claudstudio.com`})
  }
  const actions2 = React.useCallback((id)=>{
    //return (<><Link key={id} to={`/users/edit/${id}`}>Edit</Link></>)
    return (<><button data-bs-toggle="modal" data-bs-target="#riderModal"  className='btn btn-primary'><i className='fa fa-gear me-2'></i>Opciones x</button></>)
  },[])

  const columns = ['ID', 'Name', 'Age'];

  const actions = [
    {
      label: 'Edit',
      onClick: row => {
        // Acción de edición para la fila seleccionada
      }
    },
    {
      label: 'Delete',
      onClick: row => {
        // Acción de eliminación para la fila seleccionada
      }
    }
  ];
 return (
  <>
    <div className={`row justify-content-center ${Auth.theme}-style `} >
        <div className='row ms-3 mt-1 pt-4 block-radius-style min-vh-100'>
        {/*<TableCustom2 columns={columns} rows={rows} actions={actions} />*/}
         <TableCustom columm={columm} rows={dataInfo.result} actions={actions2} />

        </div>
    </div>
    </>
  )
}
