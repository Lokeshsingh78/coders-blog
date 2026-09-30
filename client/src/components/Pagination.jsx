import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 9,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // Number of pages to show on each side of currentPage

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label='Pagination Navigation'
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-slate-200 dark:border-slate-800 ${className}`}
    >
      <div className='text-sm text-slate-500 dark:text-slate-400'>
        {totalItems ? (
          <span>
            Showing <strong className='font-semibold text-slate-900 dark:text-slate-100'>{startItem}</strong> to{' '}
            <strong className='font-semibold text-slate-900 dark:text-slate-100'>{endItem}</strong> of{' '}
            <strong className='font-semibold text-slate-900 dark:text-slate-100'>{totalItems}</strong> articles
          </span>
        ) : (
          <span>
            Page <strong className='font-semibold text-slate-900 dark:text-slate-100'>{currentPage}</strong> of{' '}
            <strong className='font-semibold text-slate-900 dark:text-slate-100'>{totalPages}</strong>
          </span>
        )}
      </div>

      <div className='flex items-center space-x-1.5'>
        {/* Previous Button */}
        <button
          type='button'
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === 1
              ? 'text-slate-400 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-800/40 cursor-not-allowed'
              : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
          aria-label='Previous Page'
        >
          <HiChevronLeft className='w-4 h-4 mr-1' />
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className='flex items-center space-x-1'>
          {pages.map((p, index) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='px-2.5 py-1.5 text-sm text-slate-400 dark:text-slate-500'
                >
                  …
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type='button'
                onClick={() => onPageChange(p)}
                className={`min-w-[36px] h-9 px-3 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type='button'
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'text-slate-400 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-800/40 cursor-not-allowed'
              : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
          aria-label='Next Page'
        >
          <span>Next</span>
          <HiChevronRight className='w-4 h-4 ml-1' />
        </button>
      </div>
    </nav>
  );
}
