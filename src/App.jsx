import { useEffect, useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import { getCurrentUser } from './connecting'
import { useDispatch } from 'react-redux'
import {login as stateLogin} from "@/store/authSlice"
import { Toaster } from "@/components/ui/toaster"



function App() {
  const [loading , setLoading] = useState(true)
  const Dispatch = useDispatch()

  useEffect(()=>{

    const fetchDetails = async() => {
      await getCurrentUser()
      .then((res) => {
        setLoading(false)
        Dispatch(stateLogin(res.user))
      })
      .catch(()=>{setLoading(false)})
    }

    fetchDetails()
  } , [])

  if(!loading)return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Header/>
    <Outlet />
    </ThemeProvider>
    <Toaster/>
    </>
  )
}

export default App
