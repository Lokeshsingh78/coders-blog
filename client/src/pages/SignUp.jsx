import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='h-screen flex items-start justify-center pt-10 bg-gradient-to-br from-[#e0eafc] via-[#cfdef3] to-[#e0eafc] px-6'>
      <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white/30 backdrop-blur-lg'>
        {/* Left - Branding */}
        <div className='p-10 bg-gradient-to-br from-[#89f7fe] via-[#66a6ff] to-[#d9afd9] text-white flex flex-col justify-center'>
          <Link to='/' className='text-4xl font-extrabold mb-3 tracking-tight hover:underline flex items-center gap-2 transition-all duration-300 hover:scale-102'>
            <span className='bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md border-b-4 border-blue-500 transition-colors duration-300 hover:bg-blue-50'>
              Coder's
            </span>
            <span className='text-white relative'>
              Blog
              <span className='absolute -bottom-1 left-0 w-full h-1 bg-white/60 rounded-full shadow-sm'></span>
            </span>
          </Link>
          <p className='mt-4 text-base leading-relaxed'>
            Join our community of modern bloggers. Create an account with email, password, or sign up with Google. Built for learning, designed with love.
          </p>
        </div>

        {/* Right - Form */}
        <div className='p-10 bg-white dark:bg-gray-900'>
          <h2 className='text-3xl font-semibold text-gray-800 dark:text-white mb-6'>
            Create Account 🚀
          </h2>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <Label value='Username' className='text-gray-700 dark:text-gray-300' />
              <TextInput
                type='text'
                id='username'
                placeholder='johndoe'
                onChange={handleChange}
                shadow
                required
              />
            </div>
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
                  <span className='pl-3'>Creating Account...</span>
                </>
              ) : (
                'Sign Up'
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
            Already have an account?{' '}
            <Link to='/sign-in' className='text-cyan-600 hover:underline font-medium'>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
