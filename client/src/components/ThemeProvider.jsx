import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className='bg-slate-50 text-slate-800 dark:text-slate-100 dark:bg-[#0B0F19] min-h-screen transition-colors duration-200'>
        {children}
      </div>
    </div>
  );
}
