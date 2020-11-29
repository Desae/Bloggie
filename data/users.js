const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const saltRounds = 16;
const posts = mongoCollections.posts;
const users = mongoCollections.users;

let exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    if (!userList) throw new Error(`No users in the system`);
    return userList;
  },
  async getUserById(id) {
    const parsedId = ObjectId(id);
    if (!ObjectId.isValid(parsedId)) throw new Error(`User id is invalid`);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: parsedId });
    if (!user) throw new Error(`user not found`);
  },
  async addUser(firstName, lastName, username, email, password, bio = '') {
    if (!firstName || !lastName || !username || !email || !password || !bio)
      throw new Error(
        `Please provide input values in the following order: (firstName, lastName, username, email, password, bio)`
      );

    // firstName
    if (typeof firstName !== 'string')
      throw new Error(`Kindly ensure that the first name is a string`);
    if (firstName.trim() === '')
      throw new Error(`First Name cannot be an empty string`);

    // lastName
    if (typeof lastName !== 'string')
      throw new Error(`Kindly ensure that the last name is a string`);
    if (lastName.trim() === '')
      throw new Error(`Last Name cannot be an empty string`);

    // // email
    // if (typeof email !== 'string')
    //   throw new Error(`Kindly ensure that the email is a string`);
    // if (lastName.trim() === '')
    //   throw new Error(`Email cannot be an empty string`);

    // // bio
    // if (typeof bio !== 'string')
    //   throw new Error(`Kindly ensure that the bio is a string`);
    // if (bio.trim() === '') throw new Error(`Bio cannot be an empty string`);

    const userCollection = await users();

    // hashing password
    const plainTextPassword = password;
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    console.log(hash);

    let newUser = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hash,
      bio: bio,
      posts: []
    };

    const newInsertInfo = await userCollection.insertOne(newUser);
    if (newInsertInfo.insertedCount === 0)
      throw new Error(`User insert failed`);
    return await this.getUserById(newInsertInfo.insertedId);
  },
  async removeUser(id) {
    const userCollection = await users();
    const deletionInfo = await userCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0)
      throw new Error(`Could not delete user of id ${id}`);

    return true;
  },
  async updateUser(id, updatedUser) {
    const user = await this.getUserById(id);
    console.log(user);

    let userUpdateInfo = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio
      //password cannot be updated yet
      //password: updatedUser.password,
    };
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: id },
      { $set: userUpdateInfo }
    );

    if (!updateInfo.matchedCount && !modifiedCount)
      throw new Error(`Update failed`);
    return await this.getUserById(id);
  },

  async addPostUser(userId, blogId, blogTitle) {
    let currentUser = await this.getUserById(userId);
    console.log(currentUser);

    const userCollection = await user();
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: { posts: { id: blogId, title: blogTitle } } }
    );
  },

  async removePostFromUser(userId, blogId) {
    let currentUser = await this.getUserById(userId);
    console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $pull: { posts: { id: postId } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw new Error(`Update failed`);
    return await this.getUserById(userId);
  }
};

module.exports = exportedMethods;
