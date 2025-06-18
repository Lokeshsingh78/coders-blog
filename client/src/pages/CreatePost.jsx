import { Alert, Button, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categoryImageMap = {
  javascript: 'https://img.icons8.com/?size=512&id=PXTY4q2Sq2lG&format=png',
  reactjs: 'https://miro.medium.com/v2/resize:fit:700/1*juLLUjz7JM627G788Jpskw.png',
  nextjs: 'https://wallpapercave.com/wp/wp11846988.png',
  github: 'https://preview.redd.it/g38817mqb1361.png?auto=webp&s=61f191d6a42b645d77cbbc6ce5d6f08686b6e77a',
  html: 'https://c4.wallpaperflare.com/wallpaper/453/129/282/html5-hyper-text-markup-language-html-wallpaper-preview.jpg',
  css: 'https://img.icons8.com/?size=512&id=21278&format=png',
  python: 'https://c4.wallpaperflare.com/wallpaper/541/218/386/linux-python-programming-wallpaper-preview.jpg',
  java: 'https://img.icons8.com/?size=512&id=13679&format=png',
  c: 'https://img-c.udemycdn.com/course/750x422/5786672_2c3f.jpg',
  cpp: 'https://i.pinimg.com/736x/9b/6e/fe/9b6efe430ed7a89b0f31832b971cf1c6.jpg',
  php: 'https://kinsta.com/wp-content/uploads/2018/05/what-is-php-3-1.png',
  sql: 'https://optim.tildacdn.one/tild6238-3035-4335-a333-306335373139/-/resize/824x/-/format/webp/IMG_3349.jpg.webp',
  typescript: 'https://img.icons8.com/?size=512&id=uJM6fQYqDaZK&format=png',
  nodejs: 'https://c4.wallpaperflare.com/wallpaper/504/643/616/node-js-javascript-wallpaper-preview.jpg',
  ruby: 'https://www.liblogo.com/img-logo/ru3040r1e4-ruby-logo-ruby-an-object-oriented-programming-language-for-all-by-jack.png',
  kotlin: 'https://images.prismic.io/qovery/5fbe059d-281e-4748-8c1b-e4ba3d0ea75c_5e88cdbcbcf6e13c14c276d8_kotlin.jpg?ixlib=gatsbyFP&auto=compress%2Cformat&fit=max',
  swift: 'https://codeit.us/storage/320/conversions/1_V3CgWE7N1WHwa-9jQjgD5A-main.jpg',
  go: 'https://i.pinimg.com/736x/ca/14/27/ca1427353346347cb0107ba21e295189.jpg',
  rust: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/7b/a4/f7/7ba4f7e1-4224-3bb1-e386-5ee382d19828/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/1200x630wa.png',
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

        {formData.image && (
          <img
            src={formData.image}
            alt="Category Preview"
            className="h-32 object-contain rounded-lg mt-2"
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
