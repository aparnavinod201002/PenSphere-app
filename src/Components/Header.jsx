import React, { useContext } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { TokenAuthContext } from '../ContextAPI/TokenAuth'
import { Link } from 'react-router-dom'

function Header() {
    const {isAuthorized,setIsAuthorized}=useContext(TokenAuthContext)
    const handleLogout=()=>{
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("token")
        setIsAuthorized(false)
        navigate("/")
      }
  return (
    <>
       <div style={{marginTop:"100px"}}>
       <Navbar className="bg-danger fixed-top">
        <Container>
          <Navbar.Brand >
           <Link to={'/'} style={{textDecoration:'none',color:'white'}}>
         <img src="https://img.freepik.com/premium-vector/pen-logo-vector-simple-icon-illustration_683738-4644.jpg" width={"30px"} alt="" />
              PenSphere
           </Link>
           <Button className='btn btn-light text-danger m-1 'onClick={handleLogout}>Logout</Button>
         <Button className='btn btn-light text-danger m-1'><Link to ={'/dashboard'} style={{textDecoration:'none',color:'violet'}}>My Profile</Link></Button>
          </Navbar.Brand>
        </Container>
      </Navbar>
      </div>
    </>
  )
}

export default Header
