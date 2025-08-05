import { signOut } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../FirebaseAuth'

const LogoutButton = () => {

    const navigate = useNavigate()

    const handleLogout = () => {
        try{
            signOut(auth)
            navigate('/login')
        }catch(e){
            console.log("Error in logout", e)
        }
    }

  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default LogoutButton