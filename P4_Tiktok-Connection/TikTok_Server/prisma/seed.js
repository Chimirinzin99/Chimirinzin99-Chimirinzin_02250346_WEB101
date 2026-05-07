const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');
  console.log('Cleaning up existing data...');

  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned.');

  // Create 10 users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        bio: `This is the bio for user ${i}`,
      }
    });
    users.push(user);
    console.log(`Created user: ${user.username}`);
  }

  // Create 50 videos (5 per user)
  console.log('Creating videos...');
  const videos = [];
  for (const user of users) {
    for (let j = 1; j <= 5; j++) {
      const video = await prisma.video.create({
        data: {
          userId: user.id,
          caption: `Video ${j} from ${user.username}`,
          url: `https://example.com/videos/${user.username}_video${j}.mp4`,
          thumbnailUrl: `https://example.com/thumbnails/${user.username}_video${j}.jpg`,
          views: Math.floor(Math.random() * 10000)
        }
      });
      videos.push(video);
      console.log(`Created video: ${video.id}`);
    }
  }

  // Create 200 comments
  console.log('Creating comments...');
  for (let i = 0; i < 200; i++) {
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];

    await prisma.comment.create({
      data: {
        userId: randomUser.id,
        videoId: randomVideo.id,
        text: `This is comment ${i + 1}. Lorem ipsum dolor sit amet.`
      }
    });
    console.log(`Created comment ${i + 1}`);
  }

  // Create 300 video likes
  console.log('Creating likes...');
  const createdLikes = new Set();

  for (let i = 0; i < 300; i++) {
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const key = `${randomUser.id}_${randomVideo.id}`;

    if (!createdLikes.has(key)) {
      try {
        await prisma.like.create({
          data: {
            userId: randomUser.id,
            videoId: randomVideo.id
          }
        });
        createdLikes.add(key);
        console.log(`Created like: User ${randomUser.username} liked Video ${randomVideo.id}`);
      } catch (error) {
        console.log(`Skipping duplicate like`);
      }
    }
  }

  // Create 40 follows
  console.log('Creating follows...');
  for (let i = 0; i < 40; i++) {
    const follower = users[Math.floor(Math.random() * users.length)];
    let following = users[Math.floor(Math.random() * users.length)];

    while (follower.id === following.id) {
      following = users[Math.floor(Math.random() * users.length)];
    }

    try {
      await prisma.follow.create({
        data: {
          followerId: follower.id,
          followingId: following.id
        }
      });
      console.log(`Created follow: ${follower.username} follows ${following.username}`);
    } catch (error) {
      console.log(`Skipping duplicate follow`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });