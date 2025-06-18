import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsInstagram, BsTwitter, BsGithub, BsLinkedin, BsTelegram, BsCodeSlash } from 'react-icons/bs';
import { FaDev } from 'react-icons/fa';

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-blue-500 bg-white dark:bg-gray-900 rounded-b-lg shadow-inner'>
      <div className='w-full max-w-7xl mx-auto px-4'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-start'>
          <div className='mt-5 mb-6 md:mb-0 max-w-md'>
          <Link
  to="/"
  className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white hover:opacity-90 transition-opacity"
>
  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg shadow-md hover:bg-blue-200 transition-colors">
    Coder's
  </span>
  <span className="ml-2 text-blue-800 dark:text-white">Blog</span>
</Link>

            <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
              Sharing ideas, stories, and insights about technology and development.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10'>
            <div>
              <Footer.Title title='About' className='text-blue-700 dark:text-blue-300' />
              <Footer.LinkGroup col className='space-y-3'>
                <Footer.Link
                  href='https://dev.to/lokesh_singh'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300'
                >
                  My Blog
                </Footer.Link>
                <Footer.Link
                  href='https://lokeshsingh78.github.io/Lokesh_portfolio/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300'
                >
                  My Portfolio
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Follow' className='text-blue-700 dark:text-blue-300' />
              <Footer.LinkGroup col className='space-y-3'>
                <Footer.Link
                  href='https://github.com/singh78'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300'
                >
                  GitHub
                </Footer.Link>
                <Footer.Link 
                  href='https://t.me/Lokeshsingh123' 
                  className='text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300'
                >
                  Telegram
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider className='my-6 border-blue-100 dark:border-blue-900' />

        <div className='w-full flex flex-col sm:flex-row sm:items-center sm:justify-between py-4'>
          <Footer.Copyright
            href='#'
            by='Your blog'
            year={new Date().getFullYear()}
            className='text-gray-600 dark:text-gray-400'
          />
          <div className='flex gap-6 mt-4 sm:mt-0 sm:justify-center'>
            <Footer.Icon 
              href='https://www.instagram.com/_lokesh___3983/' 
              icon={BsInstagram} 
              className='text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300' 
            />
            <Footer.Icon 
              href='https://x.com/Not_LokeshSingh' 
              icon={BsTwitter} 
              className='text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300' 
            />
            <Footer.Icon 
              href='https://github.com/Lokeshsingh78' 
              icon={BsGithub} 
              className='text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300' 
            />
            <Footer.Icon 
              href='https://www.linkedin.com/in/lokesh-singh-tanwar/' 
              icon={BsLinkedin} 
              className='text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300' 
            />
            <Footer.Icon 
              href='https://dev.to/lokesh_singh' 
              icon={FaDev} 
              className='text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300' 
            />
            <Footer.Icon 
              href='https://leetcode.com/u/lokeshsinghtanwar78/' 
              icon={BsCodeSlash} 
              className='text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300' 
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
