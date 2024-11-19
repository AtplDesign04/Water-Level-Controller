import logo from '../assets/nys.png'
import avatar from '../assets/avatar.png'
export default function Header() {
    return(
        <header className='flex justify-between px-5 py-5 align-middle'>
            <div>
                <img src={logo} className="h-[80px]" alt="logo"/>
            </div>
            <div className='flex align-middle'>
                <h2>Hi, Admin</h2>
                <img src={avatar} alt='' className='h-[30px]'/>
            </div>
        </header>
    )
} 