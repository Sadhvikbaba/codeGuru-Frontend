import React from 'react'
import {BiLogOut} from "react-icons/bi"
import { logout } from '@/connecting/index'
import { logout as authLogout } from '@/store/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
  const Dispatch = useDispatch()
  const Navigate = useNavigate()

  const log = async() =>{
    await logout()
    .then((res) =>{ 
      Navigate("/login")
      Dispatch(authLogout())
    })
  }
  return (
    <div className='mt-auto cursor-pointer text-2xl' onClick={() => log()}>
      <BiLogOut/>
    </div>
  )
}

export default LogoutBtn