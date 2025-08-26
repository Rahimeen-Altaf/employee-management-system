const { sequelize } = require('../config/database');
const User = require('../models/User');

async function migrateDatabase() {
  try {
    console.log('Starting database migration...');
    
    // Sync the new User model structure
    await User.sync({ alter: true });
    console.log('User model synced successfully');
    
    // You can add additional migration logic here if needed
    // For example, migrating data from old employees table
    
    console.log('Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateDatabase();