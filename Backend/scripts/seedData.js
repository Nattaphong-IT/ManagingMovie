import User from '../models/user.model.js';
import connectDB from '../utils/db.js';

const sampleUsers = [
  {
    username: 'manager1',
    email: 'manager@movie.com',
    password: 'password123',
    role: 'MANAGER'
  },
  {
    username: 'teamlead1',
    email: 'teamlead@movie.com',
    password: 'password123',
    role: 'TEAMLEADER'
  },
  {
    username: 'staff1',
    email: 'staff@movie.com',
    password: 'password123',
    role: 'FLOORSTAFF'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});

    // Create users
    console.log('Creating users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create movies

    console.log('Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Manager: manager1 / password123');
    console.log('Team Leader: teamlead1 / password123');
    console.log('Staff: staff1 / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();