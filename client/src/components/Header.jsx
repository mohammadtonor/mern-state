import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-sm'>
      <div className='flex items-center justify-between mx-auto max-w-6xl p-3'>
        <Link to={'/'}>
          <h1 className='text-sm sm:text-xl font bold'>
            <span className='text-slate-500'>Mohammad</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input 
            type='text' 
            placeholder='Search...' 
            className='bg-transparent focus:outline-none w-24 sm:w-64'/>
          <FaSearch className='text-slate-500'/>
        </form>
        <ul className='flex gap-4'>
          <Link to="/">
            <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>Home</li>
          </Link>
          <Link to='/about'>
            <li>About</li>
          </Link>
          <Link to='sign-in'>
            <li>Sign in</li>
          </Link>
        </ul>
      </div>
    </header>
  )
}
