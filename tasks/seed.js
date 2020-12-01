const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const posts = data.posts;
const users = data.users;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  //firstName, lastName, username, email, password, bio = ''
  const aseda = await users.addUser(
    'Aseda',
    'Addai-Deseh',
    'aseda.o',
    'aseda.oad@gmail.com',
    'green&white33',
    'I am an audacious creative!'
  );
  //console.log(aseda);
  const id = aseda._id;

  //posterId,blogTitle,blogBody,blogImage,tags

  // const post1 = await posts.addPost(
  //   id,
  //   'A day in the life of a creative Part 1',
  //   'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog',
  //   'image1.jpg',
  //   ['Data Science', 'Machine Learning']
  // );
  // console.log(post1);

  const post2 = await posts.addPost(
    id,
    'A day in the life of a creative Part 2',
    'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog',
    'image2.jpg',
    ['NLP', 'Machine Learning']
  );
  console.log(post2);

  const post3 = await posts.addPost(
    id,
    'A day in the life of a creative Part 3',
    'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog',
    'image3.jpg',
    ['Timeseries Analysis', 'Machine Learning']
  );
  console.log(post3);

  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();
