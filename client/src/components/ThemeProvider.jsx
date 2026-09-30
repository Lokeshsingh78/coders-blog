/* eslint-disable react/prop-types */
import { useEffect } from 'react';

export default function ThemeProvider({ children }) {
  useEffect(() => {
    // Ensure the document element has no stale dark classes
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className='bg-slate-50 text-slate-800 min-h-screen'>
      {children}
    </div>
  );
}
