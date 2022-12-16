import React,{useContext} from 'react'
import ThemeContext,{themes} from '../../context/theme-context'
import AuthContext from '../../context/auth-context'
export function Index() {
  const {Auth,handlerAuth} = useContext(AuthContext);
 return (
    <div>
      <h1>INDEX USERS {themes.black} OTHER {Auth}</h1>
    </div>
  )
}
