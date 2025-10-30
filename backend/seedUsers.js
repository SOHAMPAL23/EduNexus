const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  {
    name: 'Admin User',
    email: 'admin@edunexus.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Instructor User',
    email: 'instructor@edunexus.com',
    password: 'instructor123',
    role: 'instructor'
  },
  {
    name: 'Student User',
    email: 'student@edunexus.com',
    password: 'student123',
    role: 'student'
  }
];

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Create new users
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email} (${user.role})`);
    }
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();