import { Avatar, Dropdown } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FiMenu, FiX, FiFeather } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm('');
    }
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm.trim());
    navigate(`/search?${urlParams.toString()}`);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Articles', href: '/search' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className='sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-[#0B0F19]/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 sm:h-20 gap-4'>
          {/* Brand Logo */}
          <Link
            to="/"
            className="group flex items-center focus:outline-none py-1 select-none shrink-0"
            aria-label="Coder's Blog Homepage"
          >
            {/* Typography */}
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                Coder's
              </span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ml-1.5">
                Blog
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSubmit}
            className='hidden md:flex flex-1 max-w-sm mx-4'
          >
            <div className='relative w-full'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500'>
                <AiOutlineSearch className='w-4 h-4' />
              </div>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search articles, topics, tech stack...'
                className='w-full pl-9 pr-14 py-2 text-sm bg-slate-100/80 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500'
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none'>
                <kbd className='text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-2xs'>
                  Enter
                </kbd>
              </div>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className='hidden md:flex items-center space-x-1 lg:space-x-2'>
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? path === '/'
                  : path.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Theme Toggle & Profile / Sign In */}
          <div className='flex items-center gap-2.5'>
            {/* Search Icon for Mobile */}
            <button
              type='button'
              onClick={() => navigate('/search')}
              className='md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              aria-label='Search'
            >
              <AiOutlineSearch className='w-5 h-5' />
            </button>


            {/* User Profile or Sign In Button */}
            {currentUser ? (
              <div className='flex items-center gap-2'>
                {currentUser.isAdmin && (
                  <Link
                    to='/create-post'
                    className='hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 transition-colors'
                  >
                    <FiFeather className='w-3.5 h-3.5' />
                    <span>Write</span>
                  </Link>
                )}

                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <div className='relative cursor-pointer ring-2 ring-indigo-500/30 rounded-full p-0.5 hover:ring-indigo-500 transition-all'>
                      <Avatar
                        alt={currentUser.username}
                        img={currentUser.profilePicture}
                        rounded
                        size='sm'
                      />
                    </div>
                  }
                >
                  <Dropdown.Header className='pb-2'>
                    <span className='block text-sm font-semibold text-slate-900 dark:text-white'>
                      @{currentUser.username}
                    </span>
                    <span className='block text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5'>
                      {currentUser.email}
                    </span>
                  </Dropdown.Header>
                  <Link to='/dashboard?tab=profile'>
                    <Dropdown.Item>Profile Settings</Dropdown.Item>
                  </Link>
                  {currentUser.isAdmin && (
                    <>
                      <Link to='/dashboard?tab=posts'>
                        <Dropdown.Item>Manage Posts</Dropdown.Item>
                      </Link>
                      <Link to='/create-post'>
                        <Dropdown.Item>Create New Article</Dropdown.Item>
                      </Link>
                    </>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleSignout} className='text-red-600 dark:text-red-400'>
                    Sign out
                  </Dropdown.Item>
                </Dropdown>
              </div>
            ) : (
              <Link
                to='/sign-in'
                className='inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40'
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type='button'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              aria-label='Toggle navigation menu'
            >
              {mobileMenuOpen ? (
                <FiX className='w-5 h-5' />
              ) : (
                <FiMenu className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150'>
            <form onSubmit={handleSubmit} className='px-1'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search articles...'
                className='w-full px-3.5 py-2 text-sm bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </form>
            <div className='flex flex-col space-y-1 pt-1'>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    path === link.href
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {currentUser?.isAdmin && (
                <Link
                  to='/create-post'
                  className='px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                >
                  + Write Article
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
