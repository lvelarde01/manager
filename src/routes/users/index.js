import React,{useContext} from 'react'
import ThemeContext,{themes} from '../../context/theme-context'
export function index() {
 return (
    <div>
      <h1>INDEX USERS {themes.black}</h1>
    </div>
  )
}
