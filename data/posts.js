const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const posts = mongoCollections.posts;
const users = mongoCollections.users;

let exportedMethods = {
  async getAllPosts() {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    return postList;
  },

  async getPostById(id) {
    const parsedId = ObjectId(id);
    if (!ObjectId.isValid(parsedId)) throw new Error(`Post id is invalid`);
    const postCollection = await posts();
    const post = await postCollection.findOne({ _id: parsedId });
    if (!post) throw new Error(`Post not found!`);
    return post;
  },

  async addPost(
    posterId,
    blogTitle,
    blogBody,
    blogImage,
    tags,
    likes = 0,
    comments = {}
  ) {
    if (!posterId || !blogTitle || !blogBody)
      throw new Error(
        `Please provide input values in the following order: (posterId, blogTitle, blogBody)`
      );

    // blogTitle
    if (typeof blogTitle !== 'string')
      throw new Error(`Kindly ensure that the blog title is a string`);
    if (blogTitle.trim() === '')
      throw new Error(`Blog title cannot be an empty string`);

    // blogBody
    if (typeof blogBody !== 'string')
      throw new Error(`Kindly ensure that the blog body is a string`);
    if (blogBody.trim() === '')
      throw new Error(`Blog body cannot be an empty string`);

    //tags
    if (!Array.isArray(tags)) {
      tags = [];
    }

    const postCollection = await posts();
    const userThatPosted = await users.getUserById(posterId);

    const newPost = {
      blogTitle: blogTitle,
      blogBody: blogBody,
      blogImage: blogImage,
      poster: {
        id: posterId,
        name: `${userThatPosted.firstName} ${userThatPosted.lastName}`
      },
      tags: tags,
      likes: likes,
      comments: comments
    };

    const insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0)
      throw new Error(`Sorry, post could not be added!`);

    const newId = insertInfo.insertId;
    await users.addPostToUser(posterId, newId, blogTitle);
    return await this.getPostById(newId);
  },

  async updatePost(id, updatedPost) {
    const postCollection = await posts();
    const updatedPostData = {};

    if (this.updatePost.blogTitle) {
      updatedPostData.blogTitle = updatedPost.blogTitle;
    }

    if (this.updatePost.blogBody) {
      updatedPostData.blogBody = updatedPost.blogBody;
    }

    if (this.updatePost.blogImage) {
      updatedPostData.blogImage = updatedPost.blogImage;
    }

    if (this.updatePost.tags) {
      updatedPostData.tags = updatedPost.tags;
    }

    await postCollection.updateOne({ _id: id }, { $set: updatedPostData });

    return await this.getPostById(id);
  },

  async removePost(id) {
    const postCollection = await posts();
    let post = null;
    try {
      post = await this.getPostById(id);
    } catch (e) {
      console.log(e);
      return;
    }
    const deletionInfo = await postCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw Error(`Could not delete post with id of ${id}`);
    }
    await users.removePostFromUser(post.poster.id, id);
    return true;
  },

  async increaseLikesByOne(id, post) {
    const postCollection = await posts();

    try {
      const post = postCollection.findPostById(id);
      post.likes += 1;
    } catch (e) {
      console.log(e);
    }
  },

  async addComment(postId, comment, commenterId) {
    const postCollection = await posts();

    try {
      const post = postCollection.findPostById(postId);
    } catch (e) {
      console.log(e);
    }

    await users.addCommentToPost(commenterId, postId, comment);
    return await this.getPostById(postId);
  }
};

module.exports = exportedMethods;
