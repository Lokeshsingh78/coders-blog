import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiArrowNarrowUp,
  HiOutlineExternalLink,
  HiOutlineSparkles
} from 'react-icons/hi';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { cleanText, formatCategoryName, formatDate } from '../utils/formatters';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
          setTotalUsers(data.totalUsers || 0);
          setLastMonthUsers(data.lastMonthUsers || 0);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts || []);
          setTotalPosts(data.totalPosts || 0);
          setLastMonthPosts(data.lastMonthPosts || 0);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments || []);
          setTotalComments(data.totalComments || 0);
          setLastMonthComments(data.lastMonthComments || 0);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className='w-full p-4 sm:p-6 space-y-8'>
      {/* Overview Welcome Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80'>
        <div>
          <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1'>
            <HiOutlineSparkles className='w-4 h-4' />
            <span>Platform Overview</span>
          </div>
          <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
            Editorial & Analytics Console
          </h2>
          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
            Real-time telemetry, article readership metrics, and community engagement
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Link
            to='/create-post'
            className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all'
          >
            <span>+ Write Article</span>
          </Link>
          <Link
            to='/'
            target='_blank'
            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors'
          >
            <span>Live Site</span>
            <HiOutlineExternalLink className='w-4 h-4' />
          </Link>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Total Articles */}
        <div className='bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <span className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Published Articles
              </span>
              <div className='text-3xl font-extrabold text-slate-900 dark:text-white mt-1'>
                {totalPosts}
              </div>
            </div>
            <div className='w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/50 shadow-xs'>
              <HiOutlineDocumentText className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-100 dark:border-slate-800'>
            <span className='inline-flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full'>
              <HiArrowNarrowUp className='w-3.5 h-3.5' />
              <span>+{lastMonthPosts}</span>
            </span>
            <span className='text-slate-500 dark:text-slate-400'>added last 30 days</span>
          </div>
        </div>

        {/* Total Members */}
        <div className='bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <span className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Registered Members
              </span>
              <div className='text-3xl font-extrabold text-slate-900 dark:text-white mt-1'>
                {totalUsers}
              </div>
            </div>
            <div className='w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-200/60 dark:border-cyan-800/50 shadow-xs'>
              <HiOutlineUserGroup className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-100 dark:border-slate-800'>
            <span className='inline-flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full'>
              <HiArrowNarrowUp className='w-3.5 h-3.5' />
              <span>+{lastMonthUsers}</span>
            </span>
            <span className='text-slate-500 dark:text-slate-400'>new this month</span>
          </div>
        </div>

        {/* Total Comments */}
        <div className='bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <span className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Community Discussions
              </span>
              <div className='text-3xl font-extrabold text-slate-900 dark:text-white mt-1'>
                {totalComments}
              </div>
            </div>
            <div className='w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200/60 dark:border-violet-800/50 shadow-xs'>
              <HiOutlineChatAlt2 className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-100 dark:border-slate-800'>
            <span className='inline-flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full'>
              <HiArrowNarrowUp className='w-3.5 h-3.5' />
              <span>+{lastMonthComments}</span>
            </span>
            <span className='text-slate-500 dark:text-slate-400'>contributions recently</span>
          </div>
        </div>
      </div>

      {/* Main Content Panels */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        {/* Recent Articles (8 cols) */}
        <div className='lg:col-span-8 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs'>
          <div className='p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between'>
            <div>
              <h3 className='font-bold text-slate-900 dark:text-white text-base'>
                Recent Publications
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                Latest architectural and technical articles
              </p>
            </div>
            <Link
              to='/dashboard?tab=posts'
              className='text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline'
            >
              Manage all →
            </Link>
          </div>

          <div className='overflow-x-auto'>
            <Table hoverable className='w-full text-left text-sm'>
              <Table.Head className='bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800'>
                <Table.HeadCell className='py-3 px-4'>Cover</Table.HeadCell>
                <Table.HeadCell className='py-3 px-4'>Title</Table.HeadCell>
                <Table.HeadCell className='py-3 px-4'>Category</Table.HeadCell>
                <Table.HeadCell className='py-3 px-4 text-center'>View</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y divide-slate-100 dark:divide-slate-800'>
                {posts && posts.map((post) => (
                  <Table.Row key={post._id} className='hover:bg-slate-50/70 dark:hover:bg-slate-800/50'>
                    <Table.Cell className='py-3 px-4'>
                      <div className='w-12 h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700'>
                        <img src={post.image} alt={post.title} className='w-full h-full object-cover' />
                      </div>
                    </Table.Cell>
                    <Table.Cell className='py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-sm truncate'>
                      <Link to={`/post/${post.slug}`} className='hover:text-indigo-600 transition-colors'>
                        {cleanText(post.title)}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className='py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400'>
                      <span className='px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800'>
                        {formatCategoryName(post.category)}
                      </span>
                    </Table.Cell>
                    <Table.Cell className='py-3 px-4 text-center'>
                      <Link
                        to={`/post/${post.slug}`}
                        className='text-slate-400 hover:text-indigo-600 transition-colors inline-block'
                        title='Open article'
                      >
                        <HiOutlineExternalLink className='w-4 h-4' />
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>

        {/* Recent Members & Discussions (4 cols) */}
        <div className='lg:col-span-4 space-y-6'>
          {/* Recent Members */}
          <div className='bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs'>
            <div className='flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800'>
              <h3 className='font-bold text-slate-900 dark:text-white text-sm'>
                New Members
              </h3>
              <Link
                to='/dashboard?tab=users'
                className='text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline'
              >
                View all →
              </Link>
            </div>
            <div className='space-y-3'>
              {users && users.slice(0, 4).map((user) => (
                <div key={user._id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-2.5'>
                    <img
                      src={user.profilePicture || '/author.jpg'}
                      alt={user.username}
                      className='w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700'
                    />
                    <div>
                      <div className='text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[140px]'>
                        {user.username}
                      </div>
                      <div className='text-[10px] text-slate-400'>
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                  {user.isAdmin ? (
                    <span className='text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-full'>
                      Admin
                    </span>
                  ) : (
                    <span className='text-[10px] text-slate-400'>Member</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Comments */}
          <div className='bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs'>
            <div className='flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800'>
              <h3 className='font-bold text-slate-900 dark:text-white text-sm'>
                Latest Comments
              </h3>
              <Link
                to='/dashboard?tab=comments'
                className='text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline'
              >
                Moderate →
              </Link>
            </div>
            <div className='space-y-3'>
              {comments && comments.slice(0, 3).map((c) => (
                <div key={c._id} className='p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs'>
                  <p className='text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed'>
                    "{c.content}"
                  </p>
                  <div className='flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400'>
                    <span>Likes: {c.numberOfLikes}</span>
                    <span>{formatDate(c.updatedAt || c.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

