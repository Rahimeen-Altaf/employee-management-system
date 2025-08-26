const { User, Employee } = require('../models');
const { sequelize } = require('../config/database');

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync models (force recreate tables to match new structure)
    await sequelize.sync({ force: true });
    console.log('Database synced successfully (tables recreated).');
    
    console.log('Available models:', Object.keys({ User, Employee }));

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { role: 'admin' } 
    });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@company.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      isActive: true
    });

    // Create admin employee profile
    const adminEmployee = await Employee.create({
      employeeId: 'ADMIN001',
      firstName: 'System',
      lastName: 'Administrator',
      phone: '1234567890',
      department: 'IT',
      position: 'System Administrator',
      salary: 100000,
      hireDate: new Date(),
      userId: adminUser.id
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@company.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seed function
seedAdmin();