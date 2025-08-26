const { sequelize } = require('../config/database');

const User = require('./User');
const Employee = require('./Employee')(sequelize);

module.exports = {
  User,
  Employee,
};