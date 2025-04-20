import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://twitter-clone-cloud.onrender.com/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Create a new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://twitter-clone-cloud.onrender.com/create-post', { content });
      setContent('');
      fetchPosts(); // Refresh the list of posts
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Write something..." 
          rows="4" 
          cols="50" 
        />
        <br />
        <button type="submit">Create Post</button>
      </form>

      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
