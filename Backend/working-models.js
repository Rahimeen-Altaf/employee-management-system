require('dotenv').config();
const { DataTypes } = require('sequelize');
const { sequelize } = require('./config/database');
const bcrypt = require('bcryptjs');

// User model
const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('employee', 'admin'), defaultValue: 'employee' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'users',
  timestamps: true,
});

// Employee model
const Employee = sequelize.define('Employee', {
  employeeId: { type: DataTypes.STRING, allowNull: false, unique: true },
  department: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  salary: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  hireDate: { type: DataTypes.DATEONLY, allowNull: false },
  address: { type: DataTypes.TEXT },
  dateOfBirth: { type: DataTypes.DATEONLY },
  emergencyContact: { type: DataTypes.STRING },
  emergencyPhone: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('active', 'inactive', 'terminated'), defaultValue: 'active' },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
}, {
  tableName: 'employees',
  timestamps: true,
});

// Password hashing
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Associations
User.hasOne(Employee, { foreignKey: 'userId', as: 'employeeProfile' });
Employee.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { User, Employee, sequelize };