import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
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

  const navItems = [
    ...(currentUser?.isAdmin
      ? [
          {
            id: 'dash',
            label: 'Overview',
            path: '/dashboard?tab=dash',
            icon: HiChartPie,
            isActive: tab === 'dash' || !tab,
          },
        ]
      : []),
    {
      id: 'profile',
      label: 'Profile',
      path: '/dashboard?tab=profile',
      icon: HiUser,
      isActive: tab === 'profile',
      badge: currentUser?.isAdmin ? 'Admin' : 'Member',
    },
    ...(currentUser?.isAdmin
      ? [
          {
            id: 'posts',
            label: 'Articles',
            path: '/dashboard?tab=posts',
            icon: HiDocumentText,
            isActive: tab === 'posts',
          },
          {
            id: 'users',
            label: 'Members',
            path: '/dashboard?tab=users',
            icon: HiOutlineUserGroup,
            isActive: tab === 'users',
          },
          {
            id: 'comments',
            label: 'Discussions',
            path: '/dashboard?tab=comments',
            icon: HiAnnotation,
            isActive: tab === 'comments',
          },
        ]
      : []),
  ];

  return (
    <aside className='w-full md:w-60 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 p-4 shrink-0 flex flex-col justify-between min-h-[calc(100vh-65px)]'>
      <div className='space-y-1.5'>
        <div className='px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400'>
          Console Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className='flex items-center gap-3'>
                <Icon className={`w-5 h-5 ${item.isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className='pt-4 mt-6 border-t border-slate-200/80 dark:border-slate-800/80'>
        <button
          type='button'
          onClick={handleSignout}
          className='w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer'
        >
          <HiArrowSmRight className='w-5 h-5' />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

