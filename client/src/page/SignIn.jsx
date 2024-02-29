import { useState } from 'react'
import { Link, useNavigate } from  'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInfailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export const SignIn = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInfailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      dispatch(signInfailure(error.message));
      
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h3 className='text-3xl text-center font-semibold my-7'>Sign Up</h3>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
           <input
            className='shadow appearance-none flex border rounded-lg  p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='email'
            type='email'
            onChange={handleChange}
            placeholder='Email'
          />
          <input
            className='shadow appearance-none flex border rounded-lg  p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='password'
            type='password'
            onChange={handleChange}
            placeholder='password'
          />
          <button className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>
            {loading ? "Loading...":"Sign In"}
          </button>
          <OAuth />
      </form>
      <div className='flex items-center gap-2 mt-5'>
        <p>Have an account</p>
          <Link to={'sign-up'}>
            <span className='text-blue-700'>Sign Up</span>
          </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>

  )
}
