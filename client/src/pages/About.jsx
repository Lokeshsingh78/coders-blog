import React from 'react';
import { 
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter, FaDev } from 'react-icons/fa';

export default function About() {
  const highlights = [
    {
      title: 'High Performance & Pagination',
      desc: 'Optimized database query pagination with startIndex and limit, sub-second latency, and responsive image containment.',
      icon: HiOutlineLightningBolt,
    },
    {
      title: 'Secure Authentication & Access Control',
      desc: 'JWT cookie-based authentication, password hashing with bcrypt, and role-based access control for administrative workflows.',
      icon: HiOutlineShieldCheck,
    },
    {
      title: 'Editorial Grade Typography',
      desc: 'Tailored typography system supporting syntax styling, reading progress tracking, responsive tables, and markdown formatting.',
      icon: HiOutlineCheckCircle,
    },
    {
      title: 'Clean Modular Architecture',
      desc: 'Separation of concerns across API controllers, route validation, centralized error middleware, and client state management.',
      icon: HiOutlineCheckCircle,
    },
  ];

  return (
    <div className='min-h-screen py-12 sm:py-20'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <span className='inline-flex items-center text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 mb-4'>
            About The Publication
          </span>
          <h1 className='text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4'>
            Engineering Architecture & Technical Writing
          </h1>
          <p className='text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed'>
            Coder's Blog is an independent technical publication dedicated to sharing practical insights on software engineering, distributed systems, and modern web standards.
          </p>
        </div>

        {/* Author Profile Card */}
        <div className='bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-sm mb-16'>
          <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
            <div className='w-24 h-24 rounded-2xl overflow-hidden shrink-0 ring-4 ring-indigo-500/20 shadow-md bg-slate-100 dark:bg-slate-800'>
              <img
                src='/author.jpg'
                alt='Lokesh Singh Tanwar'
                className='w-full h-full object-cover object-center'
              />
            </div>
            <div className='flex-1 text-center sm:text-left'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3'>
                <div>
                  <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
                    Lokesh Singh Tanwar
                  </h2>
                  <p className='text-sm font-medium text-indigo-600 dark:text-indigo-400'>
                    Full-Stack Software Engineer & Author
                  </p>
                </div>
                <div className='flex items-center justify-center gap-3'>
                  <a
                    href='https://github.com/Lokeshsingh78'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors'
                    aria-label='GitHub'
                  >
                    <FaGithub className='w-4 h-4' />
                  </a>
                  <a
                    href='https://www.linkedin.com/in/lokesh-singh-tanwar/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors'
                    aria-label='LinkedIn'
                  >
                    <FaLinkedin className='w-4 h-4' />
                  </a>
                  <a
                    href='https://dev.to/lokesh_singh'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors'
                    aria-label='Dev.to'
                  >
                    <FaDev className='w-4 h-4' />
                  </a>
                  <a
                    href='https://x.com/Not_LokeshSingh'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-colors'
                    aria-label='Twitter'
                  >
                    <FaTwitter className='w-4 h-4' />
                  </a>
                </div>
              </div>
              <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4'>
                Passionate about distributed architectures, high-performance web systems, and crafting responsive, accessible user interfaces. This platform serves as a technical journal documenting practical engineering challenges, architecture decisions, and code benchmarks.
              </p>
              <div className='flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800'>
                <span className='inline-flex items-center gap-1.5'>
                  <HiOutlineCheckCircle className='w-4 h-4 text-emerald-500' />
                  <span>Production Full-Stack Architecture</span>
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <HiOutlineCheckCircle className='w-4 h-4 text-emerald-500' />
                  <span>REST API Design & Security</span>
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <HiOutlineCheckCircle className='w-4 h-4 text-emerald-500' />
                  <span>Custom Design System</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Highlights */}
        <div>
          <div className='text-center sm:text-left mb-8'>
            <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Platform Architectural Features
            </h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
              Core engineering design principles focused on stability, performance, and readability.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {highlights.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className='p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs'
                >
                  <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4'>
                    <Icon className='w-5 h-5' />
                  </div>
                  <h3 className='text-base font-bold text-slate-900 dark:text-white mb-2'>
                    {feat.title}
                  </h3>
                  <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
