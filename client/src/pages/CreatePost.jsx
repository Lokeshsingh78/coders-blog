import { Alert, Button, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categoryImageMap = {
  javascript: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=1200&q=80',
  reactjs: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
  nextjs: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  github: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
  html: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  css: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  python: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
  java: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  c: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  cpp: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  php: 'https://images.unsplash.com/photo-1599507593499-a3f7f7d97f66?auto=format&fit=crop&w=1200&q=80',
  sql: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
  typescript: 'https://images.unsplash.com/photo-1516116211227-bbc0429ce2bf?auto=format&fit=crop&w=1200&q=80',
  nodejs: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80',
  ruby: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  kotlin: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80',
  swift: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
  go: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  rust: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
};

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'uncategorized',
    content: '',
    image: '',
  });

  const [publishError, setPublishError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategory,
      image: categoryImageMap[selectedCategory] || '', 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setPublishError('Title is required');
      return;
    }
    if (formData.category === 'uncategorized') {
      setPublishError('Please select a category');
      return;
    }
    if (!formData.content || formData.content.trim() === '' || formData.content === '<p><br></p>') {
      setPublishError('Content is required');
      return;
    }

    setPublishError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message || 'Failed to create post');
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            required
            className="flex-1"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            required
          >
           <option value="uncategorized" disabled selected>Select a category</option>
<option value="javascript">JavaScript</option>
<option value="reactjs">React.js</option>
<option value="nextjs">Next.js</option>
<option value="github">GitHub</option>
<option value="html">HTML</option>
<option value="css">CSS</option>
<option value="python">Python</option>
<option value="java">Java</option>
<option value="c">C</option>
<option value="cpp">C++</option>
<option value="php">PHP</option>
<option value="sql">SQL</option>
<option value="typescript">TypeScript</option>
<option value="nodejs">Node.js</option>
<option value="ruby">Ruby</option>
<option value="kotlin">Kotlin</option>
<option value="swift">Swift</option>
<option value="go">Go</option>
<option value="rust">Rust</option>
          </Select>
        </div>

        <TextInput
          type="text"
          placeholder="Custom Cover Image URL (optional)"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />

        {formData.image && (
          <img
            src={formData.image}
            alt="Cover Preview"
            className="h-44 w-full max-w-sm object-cover rounded-xl mt-2 border border-slate-200 dark:border-slate-700"
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <Button type="submit" gradientDuoTone="purpleToPink" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish'}
        </Button>

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
