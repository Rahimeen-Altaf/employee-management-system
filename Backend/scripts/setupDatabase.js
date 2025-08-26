const { sequelize } = require('../config/database');
const { User, Employee } = require('../working-models');

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established');
    
    // Sync models (create tables)
    await sequelize.sync({ force: false }); // Set to true to recreate tables
    console.log('Database tables synchronized');
    
    // Check if admin user exists
    const adminExists = await User.findOne({ where: { email: 'admin@company.com' } });
    
    if (!adminExists) {
      // Create default admin user
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@company.com',
        password: 'admin123', // Will be hashed automatically
        phone: '5551234567',
        role: 'admin'
      });
      console.log('Default admin user created');
      console.log(' Email: admin@company.com');
      console.log(' Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('\n Database setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the server: npm start');
    console.log('2. Login as admin: admin@company.com / admin123');
    console.log('3. Users can register with basic info');
    console.log('4. Admin can create employee records for users');
    
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;