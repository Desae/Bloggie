const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;

router.get('/', async (req, res) => {
  try {
    const allPosts = postData.getAllPosts();
    res.render('blogPages/allBlogs', { posts: allPosts });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await postData.getPostById(req.params.id);
    res.json(post);
  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
  }
});

router.post('/', async (req, res) => {
  const blogPostData = req.body;
  if (!blogPostData.blogTitle) {
    res.status(400).json({ error: 'You must provide blog post title' });
    return;
  }
  if (!blogPostData.blogBody) {
    res.status(400).json({ error: 'You must provide blog post body' });
    return;
  }

  // if (!blogPostData.tags) {
  //   res.status(400).json({ error: 'You must provide blog post tags' });
  //   return;
  // }
  if (!blogPostData.blogImage) {
    res.status(400).json({ error: 'You must provide blog post image' });
    return;
  }

  try {
    const { blogTitle, blogBody, tags, posterId } = blogPostData;
    const newPost = await postData.addPost(blogTitle, blogBody, tags, posterId);
    res.json(newPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.put('/:id', async (req, res) => {
  const updatedData = req.body;
  if (
    !updatedData.blogTitle ||
    !updatedData.blogBody ||
    !updatedData.posterId
  ) {
    res.status(400).json({ error: 'You must Supply All fields' });
    return;
  }

  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  try {
    const updatedPost = await postData.updatePost(req.params.id, updatedData);
    res.json(updatedPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.patch('/:id', async (req, res) => {
  const requestBody = req.body;
  let updatedObject = {};

  try {
    const oldPost = await postData.getPostById(req.params.id);
    if (requestBody.blogTitle && requestBody.blogTitle !== oldPost.blogTitle)
      updatedObject.blogTitle = requestBody.blogTitle;
    if (requestBody.blogBody && requestBody.blogBody !== oldPost.blogBody)
      updatedObject.blogBody = requestBody.blogBody;
    if (requestBody.tags && requestBody.tags !== oldPost.tags)
      updatedObject.tags = requestBody.tags;
    if (requestBody.posterId && requestBody.posterId !== oldPost.posterId)
      updatedObject.posterId = requestBody.posterId;
    if (requestBody.blogImage && requestBody.blogImage !== oldPost.blogImage)
      updatedObject.blogImage = requestBody.blogImage;
  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  try {
    const updatedPost = await postData.updatePost(req.param.id, updatedObject);
    res.json(updatedPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'You must supply and ID to delete' });
    return;
  }
  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  try {
    await postData.removePost(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get('/tag/:tag', async (req, res) => {
  const postList = await postData.getPostsByTag(req.params.tag);
  res.json(postList);
});

module.exports = router;
