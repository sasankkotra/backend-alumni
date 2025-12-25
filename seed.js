require('dotenv').config();
const { sequelize, Alumni, Admin, Event, JobPosting } = require('../src/models');

const seedDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync models
    await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    console.log('Database models synchronized.');

    // Create sample admin
    const admin = await Admin.findOrCreate({
      where: { email: 'admin@alumni.com' },
      defaults: {
        name: 'Admin User',
        email: 'admin@alumni.com',
        password_hash: 'admin123' // Will be hashed by model hook
      }
    });
    console.log('Admin created:', admin[0].email);

    // Create sample alumni
    const alumni1 = await Alumni.findOrCreate({
      where: { email: 'alumni1@example.com' },
      defaults: {
        name: 'John Doe',
        gender: 'Male',
        contact: '1234567890',
        email: 'alumni1@example.com',
        year_of_graduation: 2020,
        branch: 'Computer Science',
        CGPA: 8.5,
        placement: 'on_campus',
        higher_studies: false,
        current_field: 'Software Development',
        current_company: 'Tech Corp',
        experience_years: 3,
        password_hash: 'password123',
        verified: true,
        verified_by_admin_id: admin[0].admin_id
      }
    });

    const alumni2 = await Alumni.findOrCreate({
      where: { email: 'alumni2@example.com' },
      defaults: {
        name: 'Jane Smith',
        gender: 'Female',
        contact: '0987654321',
        email: 'alumni2@example.com',
        year_of_graduation: 2019,
        branch: 'Electrical Engineering',
        CGPA: 9.0,
        placement: 'off_campus',
        higher_studies: true,
        current_field: 'Research',
        current_company: 'University',
        experience_years: 4,
        password_hash: 'password123',
        verified: true,
        verified_by_admin_id: admin[0].admin_id
      }
    });

    const alumni3 = await Alumni.findOrCreate({
      where: { email: 'alumni3@example.com' },
      defaults: {
        name: 'Bob Johnson',
        gender: 'Male',
        contact: '1122334455',
        email: 'alumni3@example.com',
        year_of_graduation: 2021,
        branch: 'Mechanical Engineering',
        CGPA: 7.8,
        placement: 'on_campus',
        higher_studies: false,
        current_field: 'Manufacturing',
        current_company: 'Auto Industries',
        experience_years: 2,
        password_hash: 'password123',
        verified: false
      }
    });

    console.log('Sample alumni created:', {
      verified: [alumni1[0].email, alumni2[0].email],
      unverified: [alumni3[0].email]
    });

    // Create sample event
    const event = await Event.findOrCreate({
      where: { title: 'Annual Alumni Meet 2024' },
      defaults: {
        title: 'Annual Alumni Meet 2024',
        description: 'Join us for the annual alumni gathering',
        date: new Date('2024-12-15'),
        location: 'Main Auditorium',
        organizer_id: admin[0].admin_id,
        organizer_type: 'admin'
      }
    });
    console.log('Sample event created:', event[0].title);

    // Create sample job posting
    const jobPosting = await JobPosting.findOrCreate({
      where: { title: 'Senior Software Engineer' },
      defaults: {
        posted_by_alumni_id: alumni1[0].alumni_id,
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        description: 'Looking for an experienced software engineer',
        eligibility: '5+ years of experience, B.Tech in CS or related field',
        status: 'active'
      }
    });
    console.log('Sample job posting created:', jobPosting[0].title);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample credentials:');
    console.log('Admin: admin@alumni.com / admin123');
    console.log('Alumni: alumni1@example.com / password123');
    console.log('Alumni: alumni2@example.com / password123');
    console.log('Alumni (unverified): alumni3@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

seedDatabase();

