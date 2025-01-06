import React from 'react'
import { ModeToggle } from './mode-toggle'
import avatar from "@/assets/avatar.png"
import { Separator } from "@/components/ui/separator";
import { useNavigate , Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutBtn from './LogoutBtn';
import Logo from "@/assets/logo.png";



function Header() {
    const Navigate = useNavigate();
    const details = useSelector((state) => state.auth.userData) 
  return (
    <>
    <div className='flex ml-4 mr-4 mt-1 justify-between mb-2'>
        <div className='flex min-w-[30rem] '>
            <div className='text-2xl font-bold flex items-center'>
                <img src={Logo} alt=""  className="w-16 h-9 shad"/>Code Guru
            </div>
            {details && <div className='w-[25rem] flex justify-between ml-16 dark:text-gray-400 text-gray-500 mt-[0.2rem]'>
                <Link to="/problems" className='mt-2 text-md'>problems</Link>
                <Link to="/playground" className='mt-2 text-md'>playground</Link>
                <Link to="/friends" className='mt-2 text-md'>friends</Link>
                <Link to="/dashboard" className='mt-2 text-md'>profile</Link>
                </div>}
        </div>
        <div className='flex space-x-3 justify-center items-center'>
        {details && <div className='flex space-x-3 justify-center items-center cursor-pointer p-0.5 rounded-sm border-gray-400 border px-2' 
            onClick={() => Navigate("/dashboard")}>
            <img src={(details.avatar) ? details.avatar : avatar} alt="avatar" className='rounded-full w-6 h-6'/>
            <div className='text-xl font-semibold '>{details.userName}</div>
            </div>}
            { details && <div>
                <LogoutBtn/>
            </div>}
            <div>
                <ModeToggle />
            </div>
        </div>
    </div>
    <Separator/>
    </>
  )
}

export default Header
