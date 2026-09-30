import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineClock, HiOutlineCalendar } from 'react-icons/hi';
import { cleanText, formatCategoryName, formatDate, calculateReadingTime } from '../utils/formatters';

export default function PostCard({ post }) {
  if (!post) return null;

  // Extract a clean short snippet from post content (without HTML tags or raw markdown symbols)
  const plainSnippet = post.content
    ? post.content
        .replace(/<[^>]+>/g, ' ')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[#*`_~]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120) + '...'
    : '';

  const cleanTitle = cleanText(post.title);
  const categoryLabel = formatCategoryName(post.category);
  const readTime = calculateReadingTime(post.content);
  const publishedDate = formatDate(post.createdAt || post.updatedAt);

  return (
    <article className='group flex flex-col bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 h-full'>
      {/* Cover Image Frame */}
      <Link
        to={`/post/${post.slug}`}
        className='relative block aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800'
        tabIndex={-1}
        aria-hidden='true'
      >
        <img
          src={post.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
          alt={cleanTitle}
          loading='lazy'
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
        />
        <div className='absolute top-3 left-3'>
          <span className='inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-xs border border-slate-200/60 dark:border-slate-700/60'>
            {categoryLabel}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className='p-5 flex-1 flex flex-col justify-between'>
        <div>
          {/* Metadata: Date and Reading Time */}
          <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2.5'>
            <span className='inline-flex items-center gap-1'>
              <HiOutlineCalendar className='w-3.5 h-3.5' />
              <time dateTime={post.createdAt}>{publishedDate}</time>
            </span>
            <span className='text-slate-300 dark:text-slate-700'>•</span>
            <span className='inline-flex items-center gap-1'>
              <HiOutlineClock className='w-3.5 h-3.5' />
              <span>{readTime}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 leading-snug transition-colors mb-2'>
            <Link to={`/post/${post.slug}`}>
              {cleanTitle}
            </Link>
          </h3>

          {/* Excerpt Snippet */}
          {plainSnippet && (
            <p className='text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4'>
              {plainSnippet}
            </p>
          )}
        </div>

        {/* Footer Link */}
        <div className='pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between'>
          <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>
            Technical Deep Dive
          </span>
          <Link
            to={`/post/${post.slug}`}
            className='inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-200'
          >
            <span>Read article</span>
            <HiArrowRight className='w-3.5 h-3.5' />
          </Link>
        </div>
      </div>
    </article>
  );
}
