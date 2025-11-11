import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute ({children}) {
  const token = localStorage.getItem('token')
  
  return token ? <Outlet/>:<Navigate to={"/login"}/>
}

export default ProtectedRoute
