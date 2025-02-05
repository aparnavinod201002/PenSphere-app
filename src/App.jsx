
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'
import Home from './pages/Home'
import PostDetails from './pages/PostDetails'
import Dashboard from './pages/Dashboard'
import { TokenAuthContext } from './ContextAPI/TokenAuth'
import { useContext } from 'react'

function App() {
  const{isAuthorized,setIsAuthorized}=useContext(TokenAuthContext)

  return (
    <>
    <Routes>
      
      <Route path='/' element={<Home/>}/>
     
      <Route path='/login' element={<Auth/>}/>
      <Route path='/register' element={<Auth register/>}/>
      <Route path='/dashboard' element={isAuthorized?<Dashboard/>:<Home/>}/>
      <Route path='/*' element={<Navigate to={'/'}/>}/>
      </Routes>
    </>
  )
}

export default App
