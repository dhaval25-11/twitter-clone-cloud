import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running');
});

app.get('/test-db', async (req, res) => {
  try {
    const Test = mongoose.model('Test', new mongoose.Schema({ msg: String }));
    await Test.create({ msg: 'MongoDB is working!' });
    const docs = await Test.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'MongoDB connection failed', details: error.message });
  }
});


// --- New Routes to Create and Fetch Posts ---

// MongoDB Schema for Post
const postSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Route to create a post
app.post('/create-post', async (req, res) => {
  try {
    const { content } = req.body;
    const newPost = new Post({ content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
});

// Route to get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('Server running')))
  .catch(err => console.error(err));
