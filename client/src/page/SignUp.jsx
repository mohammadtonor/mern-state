import { useState } from 'react'
import { Link, useNavigate } from  'react-router-dom'

export const SignUp = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);
    setLoading(false);
    navigate('/sign-in')
    } catch (error) {
      setLoading(false);
      setError(data.message);
      
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h3 className='text-3xl text-center font-semibold my-7'>Sign Up</h3>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
          <input
            className='shadow appearance-none flex border rounded-lg  p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='username'
            type='text'
            onChange={handleChange}
            placeholder='Username'
          />
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
            {loading ? "Loading...":"Sign Up"}
          </button>
      </form>
      <div className='flex items-center gap-2 mt-5'>
        <p>Have an account</p>
          <Link to={'sign-in'}>
            <span className='text-blue-700'>Sign in</span>
          </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
