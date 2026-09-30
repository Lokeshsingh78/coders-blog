import { Link } from 'react-router-dom';
import { BsGithub, BsLinkedin, BsTwitter, BsCodeSlash } from 'react-icons/bs';
import { FaDev } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F19] text-slate-600 dark:text-slate-400 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12'>
          {/* Brand Info */}
          <div className='md:col-span-2'>
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 focus:outline-none mb-4 select-none"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-purple-500 to-pink-500 p-[1.5px] shadow-xs">
                <div className="w-full h-full bg-white dark:bg-[#0B0F19] rounded-[6.5px] flex items-center justify-center">
                  <span className="font-mono font-black text-xs bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    &lt;/&gt;
                  </span>
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  Coder's
                </span>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ml-1">
                  Blog
                </span>
              </div>
            </Link>
            <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-6'>
              An engineering publication dedicated to architectural breakdowns, distributed web systems, frontend mechanics, and database design.
            </p>
            <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
              <span className='inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
              <span>All Systems Operational · Built with MERN Stack</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4'>
              Navigation
            </h4>
            <ul className='space-y-2.5 text-sm'>
              <li>
                <Link to='/' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/search' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  All Articles
                </Link>
              </li>
              <li>
                <Link to='/search?category=javascript' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  JavaScript & React
                </Link>
              </li>
              <li>
                <Link to='/search?category=sql' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  SQL & Databases
                </Link>
              </li>
              <li>
                <Link to='/about' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  About Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect / Author Links */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4'>
              Connect
            </h4>
            <ul className='space-y-2.5 text-sm'>
              <li>
                <a
                  href='https://github.com/Lokeshsingh78'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2'
                >
                  <BsGithub className='w-4 h-4' />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href='https://www.linkedin.com/in/lokesh-singh-tanwar/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2'
                >
                  <BsLinkedin className='w-4 h-4' />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href='https://dev.to/lokesh_singh'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2'
                >
                  <FaDev className='w-4 h-4' />
                  <span>Dev.to</span>
                </a>
              </li>
              <li>
                <a
                  href='https://leetcode.com/u/lokeshsinghtanwar78/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2'
                >
                  <BsCodeSlash className='w-4 h-4' />
                  <span>LeetCode Profile</span>
                </a>
              </li>
              <li>
                <a
                  href='https://x.com/Not_LokeshSingh'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2'
                >
                  <BsTwitter className='w-4 h-4' />
                  <span>Twitter / X</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className='pt-8 mt-12 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400'>
          <p>© {currentYear} Coder's Blog. Created by Lokesh Singh Tanwar. All rights reserved.</p>
          <div className='flex items-center space-x-6'>
            <span>Engineered with React 18, Express & MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
