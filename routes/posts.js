const express = require('express');
const router = express.Router();
const data = require('../data/posts');

router.get('/', async (req, res) => {
  const allPosts = data.getAllPosts();
  res.render('blogPages/allBlogs', { posts: allPosts });
});

module.exports = router;
