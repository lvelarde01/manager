import React,{useContext} from 'react'
import ThemeContext,{themes} from '../../context/theme-context'
import AuthContext from '../../context/auth-context'
export function Index() {
  const {Auth,handlerAuth} = useContext(AuthContext);
 return (
    <div className='background-default'>
      <h1>Inicio</h1>
    </div>
  )
}
