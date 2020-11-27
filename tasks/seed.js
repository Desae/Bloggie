const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const posts = data.posts;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const aseda = await users.addUser('Aseda', 'Addai-Deseh');
  const id = aseda._id;
  const post1 = await posts.addPost(
    'A day in the life of a creative',
    'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog',
    'image1.jpg',
    {
      id: id,
      name: `${aseda.firstName} ${aseda.lastName}`
    },
    ['Data Science', 'Machine Learning']
  );
  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();
