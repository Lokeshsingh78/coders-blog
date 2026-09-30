import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import { 
  HiOutlineSearch, 
  HiOutlineAdjustments, 
  HiOutlineFilter,
  HiOutlineRefresh
} from 'react-icons/hi';
import { formatCategoryName } from '../utils/formatters';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'reactjs', label: 'React.js' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL & Databases' },
  { value: 'c', label: 'C Systems' },
  { value: 'cpp', label: 'C++' },
  { value: 'github', label: 'Git & GitHub' },
  { value: 'html', label: 'HTML & Web Standards' },
  { value: 'css', label: 'CSS & Styling' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
];

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'all',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('category') || 'all';
    const pageFromUrl = parseInt(urlParams.get('page')) || 1;

    setSidebarData({
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl,
    });
    setCurrentPage(pageFromUrl);

    const fetchPosts = async () => {
      setLoading(true);
      const startIndex = (pageFromUrl - 1) * pageSize;
      urlParams.set('startIndex', startIndex);
      urlParams.set('limit', pageSize);
      if (categoryFromUrl === 'all') {
        urlParams.delete('category');
      }

      try {
        const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
          setTotalPosts(data.totalPosts || 0);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to fetch filtered posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (sidebarData.searchTerm) urlParams.set('searchTerm', sidebarData.searchTerm);
    if (sidebarData.sort) urlParams.set('sort', sidebarData.sort);
    if (sidebarData.category && sidebarData.category !== 'all') urlParams.set('category', sidebarData.category);
    urlParams.set('page', 1);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleReset = () => {
    setSidebarData({
      searchTerm: '',
      sort: 'desc',
      category: 'all',
    });
    navigate('/search');
  };

  const handlePageChange = (page) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', page);
    navigate(`/search?${urlParams.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header Banner */}
      <div className='mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800/80'>
        <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
          Explore Technical Articles
        </h1>
        <p className='text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2'>
          Search and filter across architecture patterns, frontend frameworks, backend runtimes, and database internals.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Filters Sidebar */}
        <aside className='w-full lg:w-72 shrink-0'>
          <div className='bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs sticky top-24'>
            <div className='flex items-center justify-between pb-4 mb-4 border-b border-slate-200/60 dark:border-slate-800/60'>
              <div className='flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base'>
                <HiOutlineAdjustments className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
                <span>Filters</span>
              </div>
              <button
                type='button'
                onClick={handleReset}
                className='text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors'
              >
                <HiOutlineRefresh className='w-3.5 h-3.5' />
                <span>Reset</span>
              </button>
            </div>

            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
              {/* Search Keyword */}
              <div>
                <label
                  htmlFor='searchTerm'
                  className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2'
                >
                  Search Keyword
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400'>
                    <HiOutlineSearch className='w-4 h-4' />
                  </div>
                  <input
                    id='searchTerm'
                    type='text'
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                    placeholder='Keywords, topics...'
                    className='w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor='category'
                  className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2'
                >
                  Topic Category
                </label>
                <select
                  id='category'
                  value={sidebarData.category}
                  onChange={handleChange}
                  className='w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label
                  htmlFor='sort'
                  className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2'
                >
                  Publication Order
                </label>
                <select
                  id='sort'
                  value={sidebarData.sort}
                  onChange={handleChange}
                  className='w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
                >
                  <option value='desc'>Newest First</option>
                  <option value='asc'>Oldest First</option>
                </select>
              </div>

              {/* Submit Filter Button */}
              <button
                type='submit'
                className='w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all'
              >
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        {/* Results Area */}
        <section className='flex-1'>
          <div className='flex items-center justify-between mb-6 pb-2 border-b border-slate-200/60 dark:border-slate-800/60'>
            <div className='text-sm text-slate-600 dark:text-slate-400'>
              Found <strong className='font-bold text-slate-900 dark:text-white'>{totalPosts}</strong>{' '}
              {totalPosts === 1 ? 'article' : 'articles'}
              {sidebarData.category !== 'all' && (
                <span> in <span className='text-indigo-600 dark:text-indigo-400 font-semibold'>{formatCategoryName(sidebarData.category)}</span></span>
              )}
              {sidebarData.searchTerm && (
                <span> matching "<span className='text-indigo-600 dark:text-indigo-400 font-semibold'>{sidebarData.searchTerm}</span>"</span>
              )}
            </div>

            <div className='text-xs text-slate-500 dark:text-slate-400 hidden sm:block'>
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='h-80 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 animate-pulse'
                />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {/* Reusable Numbered Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalPosts}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                className='mt-10'
              />
            </>
          ) : (
            <div className='py-20 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800'>
              <HiOutlineFilter className='w-12 h-12 mx-auto text-slate-400 mb-3' />
              <h3 className='text-lg font-bold text-slate-900 dark:text-white mb-2'>
                No articles match your query
              </h3>
              <p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6'>
                We couldn't find any articles matching your search criteria. Try adjusting keywords or clearing category filters.
              </p>
              <button
                type='button'
                onClick={handleReset}
                className='px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700'
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
