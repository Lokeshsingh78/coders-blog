// Utility to clean up text, sanitize emojis, and format dates and categories professionally

// Preserve original blog title as written
export const cleanText = (str) => {
  if (!str) return '';
  return str.trim();
};

export const formatCategoryName = (category) => {
  if (!category) return 'Engineering';
  const cat = category.toLowerCase().trim();
  const map = {
    javascript: 'JavaScript',
    js: 'JavaScript',
    reactjs: 'React',
    react: 'React',
    nextjs: 'Next.js',
    next: 'Next.js',
    nodejs: 'Node.js',
    node: 'Node.js',
    typescript: 'TypeScript',
    ts: 'TypeScript',
    python: 'Python',
    sql: 'SQL & Data',
    c: 'C Systems',
    cpp: 'C++',
    github: 'Git & DevOps',
    html: 'Web Standards',
    css: 'CSS & Design',
    rust: 'Rust',
    go: 'Go',
    docker: 'DevOps',
    architecture: 'Architecture',
    uncategorized: 'Technical',
  };
  return map[cat] || category.charAt(0).toUpperCase() + category.slice(1);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const calculateReadingTime = (content) => {
  if (!content) return '3 min read';
  // Strip HTML tags
  const plainText = content.replace(/<[^>]+>/g, ' ');
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};
