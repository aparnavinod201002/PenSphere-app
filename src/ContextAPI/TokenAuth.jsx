import React, { useEffect, useState,createContext } from 'react'
export const TokenAuthContext=createContext()
function TokenAuth({children}) {
const [isAuthorized,setIsAuthorized]=useState(false)
useEffect(()=>{
if(sessionStorage.getItem("token")){
    setIsAuthorized(true)
}else{
    setIsAuthorized(false)
}
},[])
  return (
    <div>
        <TokenAuthContext.Provider value={{isAuthorized,setIsAuthorized}}>
        {children}
        </TokenAuthContext.Provider>
    
    </div>
  )
}

export default TokenAuth
