import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0eafc] via-[#cfdef3] to-[#e0eafc] px-6 py-16'>
      <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white/30 backdrop-blur-lg'>
        {/* Left - Branding */}
        <div className='p-10 bg-gradient-to-br from-[#89f7fe] via-[#66a6ff] to-[#d9afd9] text-white flex flex-col justify-center'>
        <Link to='/' className='text-4xl font-extrabold mb-3 tracking-tight hover:underline flex      items-center gap-2 transition-all duration-300 hover:scale-102'>
              <span className='bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md border-b-4 border-blue-500 transition-colors duration-300 hover:bg-blue-50'>
                Coder's
              </span>
              <span className='text-white relative'>
                Blog
                <span className='absolute -bottom-1 left-0 w-full h-1 bg-white/60 rounded-full shadow-sm'></span>
              </span>
      </Link>
          <p className='mt-4 text-base leading-relaxed'>
            Dive into the world of modern blogs. Use email, password, or sign in with Google. Built for learning, designed with love.
          </p>
        </div>

        {/* Right - Form */}
        <div className='p-10 bg-white dark:bg-gray-900'>
          <h2 className='text-3xl font-semibold text-gray-800 dark:text-white mb-6'>
            Welcome Back 👋
          </h2>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <Label value='Email address' className='text-gray-700 dark:text-gray-300' />
              <TextInput
                type='email'
                id='email'
                placeholder='you@example.com'
                onChange={handleChange}
                shadow
                required
              />
            </div>
            <div>
              <Label value='Password' className='text-gray-700 dark:text-gray-300' />
              <TextInput
                type='password'
                id='password'
                placeholder='••••••••'
                onChange={handleChange}
                shadow
                required
              />
            </div>
            <Button
              gradientDuoTone='cyanToBlue'
              type='submit'
              className='w-full font-medium text-white rounded-md'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>

          {errorMessage && (
            <Alert className='mt-4' color='failure'>
              {errorMessage}
            </Alert>
          )}

          <p className='mt-6 text-sm text-gray-600 dark:text-gray-400'>
            Don’t have an account?{' '}
            <Link to='/sign-up' className='text-cyan-600 hover:underline font-medium'>
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
