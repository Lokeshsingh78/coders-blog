import { Spinner } from 'flowbite-react';
import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineShare, 
  HiOutlineClipboardCheck,
  HiOutlineChevronRight,
  HiOutlineMenuAlt2
} from 'react-icons/hi';
import { cleanText, formatCategoryName, formatDate, calculateReadingTime } from '../utils/formatters';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef(null);

  // Scroll reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch current post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok && data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
          setError(false);
        } else {
          setError(true);
        }
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  // Fetch recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts.filter((p) => p.slug !== postSlug).slice(0, 3));
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchRecentPosts();
  }, [postSlug]);

  // Extract headings from post content & setup smooth anchors
  useEffect(() => {
    if (!contentRef.current || !post?.content) return;

    const headingEls = contentRef.current.querySelectorAll('h2, h3');
    const items = [];

    headingEls.forEach((el, index) => {
      const cleanHeading = el.innerText.trim();
      if (!cleanHeading) return;

      let slugId = cleanHeading
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      if (!slugId) slugId = `section-${index}`;

      el.id = slugId;
      el.classList.add('scroll-mt-24');

      items.push({
        id: slugId,
        text: cleanHeading
          .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
          .trim(),
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    setHeadings(items);
    if (items.length > 0) {
      setActiveHeading(items[0].id);
    }
  }, [post?.content]);

  // Track active heading on scroll
  useEffect(() => {
    const handleHeadingHighlight = () => {
      if (!contentRef.current) return;
      const headingEls = contentRef.current.querySelectorAll('h2, h3');
      const scrollPosition = window.scrollY + 140;

      for (let i = headingEls.length - 1; i >= 0; i--) {
        const el = headingEls[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveHeading(el.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleHeadingHighlight, { passive: true });
    return () => window.removeEventListener('scroll', handleHeadingHighlight);
  }, [post?.content]);

  // Add copy-code buttons to all <pre> elements inside post-content
  useEffect(() => {
    if (!contentRef.current) return;
    const preBlocks = contentRef.current.querySelectorAll('pre');
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-code-btn')) return; // already added

      pre.style.position = 'relative';
      const btn = document.createElement('button');
      btn.className =
        'copy-code-btn absolute top-2.5 right-2.5 px-2.5 py-1 text-xs font-mono font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-700/90 rounded-md border border-slate-700 transition-colors flex items-center gap-1 opacity-90 hover:opacity-100 shadow-sm';
      btn.innerHTML = '<span>Copy</span>';
      btn.type = 'button';

      btn.addEventListener('click', () => {
        const codeText = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(codeText.replace(/^Copy\n/, ''));
        btn.innerHTML = '<span>✓ Copied</span>';
        btn.classList.add('text-emerald-400', 'border-emerald-500/40');
        setTimeout(() => {
          btn.innerHTML = '<span>Copy</span>';
          btn.classList.remove('text-emerald-400', 'border-emerald-500/40');
        }, 2000);
      });

      pre.appendChild(btn);
    });
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveHeading(id);
    }
  };

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[70vh] gap-3'>
        <Spinner size='xl' />
        <span className='text-sm text-slate-500 dark:text-slate-400 font-medium'>
          Loading article...
        </span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className='max-w-2xl mx-auto my-20 p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
          Article Not Found
        </h2>
        <p className='text-slate-600 dark:text-slate-400 mb-6 text-sm'>
          The article you are looking for may have been moved or updated.
        </p>
        <Link
          to='/search'
          className='inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors'
        >
          Browse All Articles
        </Link>
      </div>
    );
  }

  const cleanTitle = cleanText(post.title);
  const categoryLabel = formatCategoryName(post.category);
  const formattedDate = formatDate(post.createdAt || post.updatedAt);
  const readingTime = calculateReadingTime(post.content);

  return (
    <>
      {/* Sticky Reading Progress Bar */}
      <div className='fixed top-0 left-0 right-0 h-1 z-50 bg-transparent'>
        <div
          className='h-full bg-indigo-600 transition-all duration-150 ease-out'
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className='min-h-screen py-8 sm:py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Breadcrumb Navigation */}
          <nav className='flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6'>
            <Link to='/' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
              Home
            </Link>
            <HiOutlineChevronRight className='w-3 h-3 text-slate-400' />
            <Link to='/search' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
              Articles
            </Link>
            <HiOutlineChevronRight className='w-3 h-3 text-slate-400' />
            <Link
              to={`/search?category=${post.category}`}
              className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-slate-700 dark:text-slate-300'
            >
              {categoryLabel}
            </Link>
          </nav>

          {/* 12-Column Responsive Editorial Layout */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start'>
            {/* Main Article Content Column (8 cols on desktop) */}
            <div className='lg:col-span-8 min-w-0'>
              {/* Category Tag */}
              <div className='mb-4'>
                <Link
                  to={`/search?category=${post.category}`}
                  className='inline-flex items-center text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 hover:bg-indigo-100 transition-colors'
                >
                  {categoryLabel}
                </Link>
              </div>

              {/* Article Title */}
              <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2] mb-6'>
                {cleanTitle}
              </h1>

              {/* Author Byline & Article Metadata Bar */}
              <div className='flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 dark:border-slate-800/80 my-6'>
                <div className='flex items-center gap-3'>
                  <div className='w-11 h-11 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 ring-2 ring-indigo-500/20'>
                    <img
                      src='/author.jpg'
                      alt='Lokesh Singh Tanwar'
                      className='w-full h-full object-cover object-center'
                    />
                  </div>
                  <div>
                    <div className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                      Lokesh Singh
                    </div>
                    <div className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
                      <span className='inline-flex items-center gap-1'>
                        <HiOutlineCalendar className='w-3.5 h-3.5' />
                        <span>{formattedDate}</span>
                      </span>
                      <span>•</span>
                      <span className='inline-flex items-center gap-1'>
                        <HiOutlineClock className='w-3.5 h-3.5' />
                        <span>{readingTime}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Share & Action Controls */}
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    onClick={handleCopyLink}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors'
                    title='Copy link to clipboard'
                  >
                    {copied ? (
                      <>
                        <HiOutlineClipboardCheck className='w-4 h-4 text-emerald-500' />
                        <span className='text-emerald-500 font-semibold'>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineShare className='w-4 h-4 text-slate-500' />
                        <span>Share Article</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Cover Image Frame with Perfect Aspect Ratio and Padding */}
              <div className='my-8'>
                <div className='relative w-full aspect-[16/9] max-h-[520px] overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-md bg-slate-100 dark:bg-slate-900'>
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'}
                    alt={cleanTitle}
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>

              {/* Article Body Content */}
              <div
                ref={contentRef}
                className='post-content'
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Author Biography Footer Card */}
              <div className='mt-14 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5'>
                <div className='w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500/30 bg-slate-100 dark:bg-slate-800'>
                  <img
                    src='/author.jpg'
                    alt='Lokesh Singh Tanwar'
                    className='w-full h-full object-cover object-center'
                  />
                </div>
                <div className='flex-1 text-center sm:text-left'>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2'>
                    <div>
                      <h2 className='text-lg font-bold text-slate-900 dark:text-white'>
                        Lokesh Singh Tanwar
                      </h2>
                      <p className='text-xs text-indigo-600 dark:text-indigo-400 font-medium'>
                        Full-Stack Engineer & Technical Writer
                      </p>
                    </div>
                    <div className='flex items-center justify-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                      <a href='https://github.com/Lokeshsingh78' target='_blank' rel='noreferrer' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                        GitHub
                      </a>
                      <span>·</span>
                      <a href='https://www.linkedin.com/in/lokesh-singh-tanwar/' target='_blank' rel='noreferrer' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                        LinkedIn
                      </a>
                      <span>·</span>
                      <a href='https://x.com/Not_LokeshSingh' target='_blank' rel='noreferrer' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                        Twitter
                      </a>
                    </div>
                  </div>
                  <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                    Building robust, scalable applications across the modern JavaScript and distributed systems ecosystem. Writing about web architecture, database design, and software best practices.
                  </p>
                </div>
              </div>

              {/* Comments Section */}
              <div className='mt-12 pt-8 border-t border-slate-200 dark:border-slate-800'>
                <CommentSection postId={post._id} />
              </div>
            </div>

            {/* Sticky Sidebar on Desktop (4 cols on desktop, hidden on mobile/tablet) */}
            <aside className='hidden lg:block lg:col-span-4 sticky top-24 space-y-6'>
              {/* Interactive Table of Contents */}
              {headings.length > 0 && (
                <div className='bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs'>
                  <div className='flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white'>
                    <HiOutlineMenuAlt2 className='w-4 h-4 text-indigo-600 dark:text-indigo-400' />
                    <span>Table of Contents</span>
                  </div>
                  <nav className='space-y-1 max-h-[380px] overflow-y-auto pr-1 text-xs'>
                    {headings.map((h, idx) => (
                      <a
                        key={idx}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToHeading(h.id);
                        }}
                        className={`block py-1.5 px-2.5 rounded-lg transition-all ${
                          activeHeading === h.id
                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/90 dark:bg-indigo-950/70 border-l-2 border-indigo-600'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        } ${h.level === 3 ? 'ml-3 text-[11px]' : ''}`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Author Sticky Mini Card */}
              <div className='bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs'>
                <div className='flex items-center gap-3 mb-3'>
                  <img
                    src='/author.jpg'
                    alt='Lokesh Singh'
                    className='w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20'
                  />
                  <div>
                    <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                      Lokesh Singh Tanwar
                    </h3>
                    <p className='text-xs text-indigo-600 dark:text-indigo-400 font-medium'>
                      Full-Stack Engineer
                    </p>
                  </div>
                </div>
                <p className='text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4'>
                  Technical writeups on systems design, web standards, databases, and production software engineering.
                </p>
                <div className='flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                  <a href='https://github.com/Lokeshsingh78' target='_blank' rel='noreferrer' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                    GitHub
                  </a>
                  <span>•</span>
                  <a href='https://www.linkedin.com/in/lokesh-singh-tanwar/' target='_blank' rel='noreferrer' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                    LinkedIn
                  </a>
                  <span>•</span>
                  <a href='https://x.com/Not_LokeshSingh' target='_blank' rel='noreferrer' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                    Twitter
                  </a>
                </div>
              </div>

              {/* Article Share & Fast Actions */}
              <div className='bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs'>
                <h3 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3'>
                  Share This Article
                </h3>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={handleCopyLink}
                    className='flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors'
                  >
                    {copied ? (
                      <>
                        <HiOutlineClipboardCheck className='w-4 h-4 text-emerald-500' />
                        <span className='text-emerald-500 font-semibold'>Copied!</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineShare className='w-4 h-4 text-slate-500' />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(cleanTitle)}&url=${encodeURIComponent(window.location.href)}`}
                    target='_blank'
                    rel='noreferrer'
                    className='p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors'
                    title='Share on Twitter / X'
                  >
                    <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target='_blank'
                    rel='noreferrer'
                    className='p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors'
                    title='Share on LinkedIn'
                  >
                    <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'><path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/></svg>
                  </a>
                </div>
              </div>
            </aside>
          </div>

          {/* Recent / Related Articles Section */}
          {recentPosts && recentPosts.length > 0 && (
            <section className='mt-20 pt-12 border-t border-slate-200 dark:border-slate-800'>
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
                    Recommended Reading
                  </h2>
                  <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                    Explore more architectural and software engineering insights
                  </p>
                </div>
                <Link
                  to='/search'
                  className='text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline hidden sm:block'
                >
                  View all articles →
                </Link>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {recentPosts.map((rPost) => (
                  <PostCard key={rPost._id} post={rPost} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}

