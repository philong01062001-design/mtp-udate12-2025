const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Mock posts database
const posts = [
  {
    id: 1,
    title: 'Welcome to our Fan Community!',
    content: 'Join us in celebrating our favorite artists and connect with fellow fans.',
    author: 'Admin',
    authorId: 1,
    likes: 15,
    comments: [],
    createdAt: new Date('2024-01-01')
  }
];

// Get all posts
router.get('/', (req, res) => {
  res.json({ posts: posts.sort((a, b) => b.createdAt - a.createdAt) });
});

// Get single post
router.get('/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json({ post });
});

// Create post (authenticated)
router.post('/', authMiddleware, (req, res) => {
  const { title, content } = req.body;
  
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    author: req.user.email,
    authorId: req.user.id,
    likes: 0,
    comments: [],
    createdAt: new Date()
  };

  posts.push(newPost);
  res.status(201).json({ message: 'Post created', post: newPost });
});

// Like post
router.post('/:id/like', authMiddleware, (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  post.likes += 1;
  res.json({ message: 'Post liked', post });
});

// Add comment
router.post('/:id/comment', authMiddleware, (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = {
    id: post.comments.length + 1,
    content: req.body.content,
    author: req.user.email,
    authorId: req.user.id,
    createdAt: new Date()
  };

  post.comments.push(comment);
  res.status(201).json({ message: 'Comment added', comment });
});

// Delete post (authenticated, own posts only)
router.delete('/:id', authMiddleware, (req, res) => {
  const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const post = posts[postIndex];
  if (post.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  posts.splice(postIndex, 1);
  res.json({ message: 'Post deleted' });
});

module.exports = router;
