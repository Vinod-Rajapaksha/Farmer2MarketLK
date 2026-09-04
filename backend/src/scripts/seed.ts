import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, UserRole } from '../models/User';
import { Produce } from '../models/Produce';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany();
    await Produce.deleteMany();
    console.log('Cleared existing data.');

    // Password for all users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@gmail.com',
      passwordHash: adminPasswordHash,
      phone: '0710000000',
      district: 'Colombo',
      role: UserRole.ADMIN,
    });
    console.log('Admin user created (admin@gmail.com / admin123)');

    // 2. Create sample Farmer
    const farmerUser = await User.create({
      name: 'Kamal Silva',
      email: 'farmer@test.com',
      passwordHash,
      phone: '0771111111',
      district: 'Kurunegala',
      role: UserRole.FARMER,
    });
    console.log('Farmer user created (farmer@test.com / password123)');

    // 3. Create sample Buyer
    const buyerUser = await User.create({
      name: 'Nimal Perera',
      email: 'buyer@test.com',
      passwordHash,
      phone: '0772222222',
      district: 'Colombo',
      role: UserRole.BUYER,
    });
    console.log('Buyer user created (buyer@test.com / password123)');

    // 4. Create sample Produce
    await Produce.insertMany([
      {
        farmerId: farmerUser._id as any,
        name: 'Fresh Tomatoes',
        category: 'Vegetables',
        quantity: 500,
        unit: 'kg',
        price: 180,
        district: 'Kurunegala',
        availableDate: new Date(),
        description: 'Freshly harvested organic tomatoes.',
        status: 'AVAILABLE',
      },
      {
        farmerId: farmerUser._id as any,
        name: 'Carrot',
        category: 'Vegetables',
        quantity: 200,
        unit: 'kg',
        price: 350,
        district: 'Nuwara Eliya',
        availableDate: new Date(),
        description: 'Large carrots directly from Nuwara Eliya farms.',
        status: 'AVAILABLE',
      },
    ]);
    console.log('Sample produce created.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
