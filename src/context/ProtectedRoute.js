import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute ({children}) {
  // console.log("hii")
  const token = localStorage.getItem('token')
  
  return token ? <Outlet/>:<Navigate to={"/login"}/>
}

export default ProtectedRoute
