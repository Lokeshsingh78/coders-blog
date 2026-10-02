import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import { HiArrowRight, HiOutlineTerminal, HiOutlineSparkles, HiOutlineClock, HiOutlineCalendar } from 'react-icons/hi';
import { cleanText, formatCategoryName, formatDate, calculateReadingTime } from '../utils/formatters';

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'reactjs', label: 'React' },
  { id: 'nodejs', label: 'Node.js' },
  { id: 'python', label: 'Python' },
  { id: 'sql', label: 'SQL & Data' },
  { id: 'c', label: 'C Systems' },
  { id: 'nextjs', label: 'Next.js' },
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const startIndex = (currentPage - 1) * pageSize;
        const categoryQuery = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
        const res = await fetch(`/api/post/getPosts?startIndex=${startIndex}&limit=${pageSize}${categoryQuery}`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts || []);
          setTotalPosts(data.totalPosts || 0);
          setTotalPages(data.totalPages || 1);

          // Set first post as featured if on page 1 and viewing all
          if (currentPage === 1 && selectedCategory === 'all' && data.posts?.length > 0) {
            setFeaturedPost(data.posts[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching home posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, selectedCategory]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className='min-h-screen'>
      {/* Hero Header Section */}
      <section className='border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40 dark:from-[#0B0F19] dark:via-slate-900/40 dark:to-[#0B0F19] pt-8 pb-16 sm:pb-24 transition-colors'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50 mb-6'>
              <HiOutlineTerminal className='w-4 h-4 text-indigo-500' />
              <span>Software Engineering & Architecture</span>
            </div>

            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6'>
              Engineering Insights, Distributed Systems & Modern Web Standards.
            </h1>

            <p className='text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-8'>
              In-depth technical writeups on systems design, production JavaScript, database internals, and performance optimization for professional developers.
            </p>

            <div className='flex flex-wrap items-center gap-4'>
              <Link
                to='/search'
                className='inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all'
              >
                <span>Browse All Articles</span>
                <HiArrowRight className='w-4 h-4' />
              </Link>
              <Link
                to='/about'
                className='inline-flex items-center px-5 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors'
              >
                About The Author
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spotlight Article (Only on All Topics, Page 1) */}
      {featuredPost && currentPage === 1 && selectedCategory === 'all' && (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 mb-12'>
          <div className='bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl transition-all'>
            <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4'>
              <HiOutlineSparkles className='w-4 h-4' />
              <span>Featured Technical Article</span>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
              <div className='lg:col-span-7 flex flex-col justify-between'>
                <div>
                  <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3'>
                    <span className='px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300'>
                      {formatCategoryName(featuredPost.category)}
                    </span>
                    <span>•</span>
                    <span className='inline-flex items-center gap-1'>
                      <HiOutlineCalendar className='w-3.5 h-3.5' />
                      <time dateTime={featuredPost.createdAt}>{formatDate(featuredPost.createdAt)}</time>
                    </span>
                    <span>•</span>
                    <span className='inline-flex items-center gap-1'>
                      <HiOutlineClock className='w-3.5 h-3.5' />
                      <span>{calculateReadingTime(featuredPost.content)}</span>
                    </span>
                  </div>

                  <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4'>
                    <Link to={`/post/${featuredPost.slug}`}>
                      {cleanText(featuredPost.title)}
                    </Link>
                  </h2>

                  <p className='text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6'>
                    {featuredPost.content
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/```[\s\S]*?```/g, '')
                      .replace(/\s+/g, ' ')
                      .trim()}
                  </p>
                </div>

                <div>
                  <Link
                    to={`/post/${featuredPost.slug}`}
                    className='inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700'
                  >
                    <span>Read Full Breakdown</span>
                    <HiArrowRight className='w-4 h-4' />
                  </Link>
                </div>
              </div>

              <div className='lg:col-span-5'>
                <Link
                  to={`/post/${featuredPost.slug}`}
                  className='block aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800'
                >
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content & Articles Section */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {/* Category Filters Bar */}
        <div className='flex items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80 flex-wrap'>
          <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none'>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className='text-xs font-medium text-slate-500 dark:text-slate-400'>
            {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} published
          </div>
        </div>

        {/* Articles Grid */}
        <div className='py-8'>
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className='py-16 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800'>
              <h3 className='text-lg font-bold text-slate-900 dark:text-white mb-2'>
                No articles found in this category
              </h3>
              <p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
                Try selecting another topic filter or view all technical articles.
              </p>
              <button
                onClick={() => handleCategorySelect('all')}
                className='px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700'
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Full Professional Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalPosts}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          className='mt-8'
        />
      </main>
    </div>
  );
}
