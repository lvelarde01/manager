import React,{useContext} from 'react'
import {Link} from 'react-router-dom';
import ThemeContext,{themes} from '../../context/theme-context'
import AuthContext from '../../context/auth-context'
import TableCustom from '../../assets/tableCustom';
export async function loader({request}){

 
}
export function Index() {
  const {Auth,handlerAuth} = useContext(AuthContext);
  const columm = [
    {'label':'id','field':'id','hide':false},
    {'label':'Usuario','field':'username'},
    {'label':'Email','field':'email','hide':false},
  ];
  const rows = [];
  for (let index = 0; index <= 100; index++) {
    rows.push({'id':index,'username':`velarde${index}`,'email':`velarde${index}@claudstudio.com`})
  }
  const actions = React.useCallback((id)=>{
    return (<><Link key={id} to={`users/edit${id}`}>Edit</Link></>)
  },[])
 return (
  <div className={`row justify-content-center ${Auth.theme}-style`} >
        <div className='row ms-3 mt-3 block-radius-style'>

      <TableCustom columm={columm} rows={rows} actions={actions} />
    </div>
    </div>

  )
}
