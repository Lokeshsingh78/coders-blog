import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const postData = {
        title: title.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // author: { id: currentUser.uid, name: currentUser.displayName }, // Optional: add if you manage users
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);
      console.log('Post created with ID:', docRef.id);

      // Reset form
      setTitle('');
      setContent('');
      setLoading(false);
      setError(null);

      alert('Post created successfully!');

      // Scroll to top after creation (optional)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Create post error:', err);
      setError('Failed to create post: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="create-post" style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2
        style={{
          textAlign: 'center',
          marginBottom: 30,
          color: '#333',
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        Create New Blog Post
      </h2>

      {error && (
        <div
          style={{
            padding: 15,
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: 8,
            color: '#c33',
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#fff',
          padding: 30,
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e1e5e9',
        }}
      >
        <div className="form-group" style={{ marginBottom: 25 }}>
          <label
            htmlFor="title"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: 8,
              color: '#333',
              fontSize: 16,
            }}
          >
            Post Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 15,
              border: '2px solid #e1e5e9',
              borderRadius: 8,
              fontSize: 16,
              fontFamily: 'inherit',
              transition: 'border-color 0.3s ease',
              outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#007bff')}
            onBlur={(e) => (e.target.style.borderColor = '#e1e5e9')}
            placeholder="Enter an engaging title for your blog post"
            disabled={loading}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 30 }}>
          <label
            htmlFor="content"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: 8,
              color: '#333',
              fontSize: 16,
            }}
          >
            Post Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            style={{
              width: '100%',
              padding: 15,
              border: '2px solid #e1e5e9',
              borderRadius: 8,
              fontSize: 16,
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: 300,
              lineHeight: 1.6,
              transition: 'border-color 0.3s ease',
              outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#007bff')}
            onBlur={(e) => (e.target.style.borderColor = '#e1e5e9')}
            placeholder="Write your blog content here... Share your thoughts, ideas, and stories with your readers."
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 18,
            fontSize: 18,
            fontWeight: 600,
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : '0 2px 8px rgba(0,123,255,0.3)',
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {loading ? 'Publishing Post...' : 'Publish Blog Post'}
        </button>
      </form>

      <div
        style={{
          textAlign: 'center',
          marginTop: 20,
          padding: 15,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          color: '#6c757d',
          fontSize: 14,
        }}
      >
        <p style={{ margin: 0 }}>
          📝 Write engaging content that resonates with your readers. Take your time to craft a
          compelling story or share valuable insights.
        </p>
      </div>
    </div>
  );
};

export default CreatePost;
