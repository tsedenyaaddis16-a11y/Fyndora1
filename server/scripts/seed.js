import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Career } from '../models/Career.js';
import { Scholarship } from '../models/Scholarship.js';
import { Opportunity } from '../models/Opportunity.js';
import { SEED_CAREERS, SEED_SCHOLARSHIPS, SEED_OPPORTUNITIES } from '../data/seedData.js';

export const seedDatabase = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('Skipping database seeding because MongoDB is not connected.');
      return;
    }

    console.log('🌱 Seeding PathFinder demo data...');

    // 1. Seed Admin User
    const adminEmail = 'admin@pathfinder.org';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'PathFinder Admin',
        email: adminEmail,
        password: 'admin12345',
        role: 'admin',
        country: 'Ethiopia',
        nationality: 'Ethiopia',
        grade: 'Staff',
      });
      console.log(' Created default Admin: admin@pathfinder.org / admin12345');
    }

    // 2. Seed Student User
    const studentEmail = 'selam.haile@pathfinder.org';
    const existingStudent = await User.findOne({ email: studentEmail });
    if (!existingStudent) {
      await User.create({
        name: 'Selam Haile',
        email: studentEmail,
        password: 'student12345',
        role: 'student',
        age: 17,
        country: 'Ethiopia',
        nationality: 'Ethiopia',
        grade: 'Grade 11',
        graduationYear: 2027,
        interests: ['Technology', 'Engineering'],
        preferredCountries: ['USA', 'Canada', 'Germany'],
        preferredFields: ['Computer Science', 'Software Engineering'],
        fundingPreference: 'Fully funded',
      });
      console.log(' Created default Student: selam.haile@pathfinder.org / student12345');
    }

    // 3. Seed Careers if empty
    const careerCount = await Career.countDocuments();
    if (careerCount === 0) {
      await Career.insertMany(SEED_CAREERS);
      console.log(` Seeded ${SEED_CAREERS.length} career pathways`);
    } else {
      console.log(` Careers collection already contains ${careerCount} items`);
    }

    // 4. Seed Scholarships if empty
    const scholarshipCount = await Scholarship.countDocuments();
    if (scholarshipCount === 0) {
      await Scholarship.insertMany(SEED_SCHOLARSHIPS);
      console.log(` Seeded ${SEED_SCHOLARSHIPS.length} scholarships`);
    } else {
      console.log(` Scholarships collection already contains ${scholarshipCount} items`);
    }

    // 5. Seed Opportunities if empty
    const oppCount = await Opportunity.countDocuments();
    if (oppCount === 0) {
      await Opportunity.insertMany(SEED_OPPORTUNITIES);
      console.log(` Seeded ${SEED_OPPORTUNITIES.length} opportunities`);
    } else {
      console.log(` Opportunities collection already contains ${oppCount} items`);
    }

    console.log(' Demo data seeding complete!');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  }
};

// If executed directly from CLI: `node scripts/seed.js`
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
