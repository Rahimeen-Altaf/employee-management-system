const { User, Employee } = require('../working-models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Get all users without employee records (for admin to create employee records)
const getUsersWithoutEmployeeRecords = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'employee' // Only get users with employee role
      },
      include: [{
        model: Employee,
        as: 'employeeProfile',
        required: false // LEFT JOIN to include users without employee records
      }],
      attributes: { exclude: ['password'] }
    });

    // Filter out users who already have employee records
    const usersWithoutEmployeeRecords = users.filter(user => !user.employeeProfile);

    res.status(200).json({
      data: { users: usersWithoutEmployeeRecords },
      succeeded: true,
      message: 'Users without employee records retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting users without employee records:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

// Get all employees with pagination and search
const getEmployees = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      department = '', 
      status = '' 
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build where clause for search and filters
    const whereClause = {};
    const userWhereClause = {};
    
    if (search) {
      // Don't put search conditions in userWhereClause as it makes the include required
      // Instead, we'll use a more complex query structure
      whereClause[Op.or] = [
        { employeeId: { [Op.iLike]: `%${search}%` } },
        { position: { [Op.iLike]: `%${search}%` } },
        { department: { [Op.iLike]: `%${search}%` } },
        { '$user.firstName$': { [Op.iLike]: `%${search}%` } },
        { '$user.lastName$': { [Op.iLike]: `%${search}%` } },
        { '$user.email$': { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (department) {
      whereClause.department = { [Op.iLike]: `%${department}%` };
    }
    
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await Employee.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] }
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      data: {
        employees: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
      succeeded: true,
      message: 'Employees retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting employees:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

// Get single employee
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] }
      }]
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      data: { employee },
      succeeded: true,
      message: 'Employee retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

// Create new employee record for existing user (Admin only)
const createEmployee = async (req, res) => {
  try {
    const {
      userId,
      employeeId,
      department,
      position,
      salary,
      hireDate,
      address,
      dateOfBirth,
      emergencyContact,
      emergencyPhone,
      status = 'active'
    } = req.body;

    // Validate required fields
    if (!userId || !employeeId) {
      return res.status(400).json({ message: "User ID and Employee ID are required" });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has an employee record
    const existingEmployee = await Employee.findOne({ where: { userId } });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee record already exists for this user" });
    }

    // Check if employeeId already exists
    const existingEmployeeId = await Employee.findOne({ where: { employeeId } });
    if (existingEmployeeId) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    // Create employee record
    const newEmployee = await Employee.create({
      employeeId,
      department,
      position,
      salary,
      hireDate,
      address,
      dateOfBirth,
      emergencyContact,
      emergencyPhone,
      status,
      userId
    });

    // Get the created employee with user info
    const employeeWithUser = await Employee.findByPk(newEmployee.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] }
      }]
    });

    res.status(201).json({
      data: { employee: employeeWithUser },
      succeeded: true,
      message: 'Employee record created successfully',
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await Employee.findByPk(id, {
      include: [{
        model: User,
        as: 'user'
      }]
    });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Separate user data from employee data
    const userData = {};
    const employeeData = {};

    // User fields
    if (updateData.firstName) userData.firstName = updateData.firstName;
    if (updateData.lastName) userData.lastName = updateData.lastName;
    if (updateData.email) userData.email = updateData.email;
    if (updateData.phone) userData.phone = updateData.phone;

    // Employee fields
    if (updateData.employeeId) employeeData.employeeId = updateData.employeeId;
    if (updateData.department) employeeData.department = updateData.department;
    if (updateData.position) employeeData.position = updateData.position;
    if (updateData.salary) employeeData.salary = updateData.salary;
    if (updateData.hireDate) employeeData.hireDate = updateData.hireDate;
    if (updateData.address) employeeData.address = updateData.address;
    if (updateData.dateOfBirth) employeeData.dateOfBirth = updateData.dateOfBirth;
    if (updateData.emergencyContact) employeeData.emergencyContact = updateData.emergencyContact;
    if (updateData.emergencyPhone) employeeData.emergencyPhone = updateData.emergencyPhone;
    if (updateData.status) employeeData.status = updateData.status;

    // Check for duplicates
    if (updateData.employeeId && updateData.employeeId !== employee.employeeId) {
      const existingEmployee = await Employee.findOne({ 
        where: { employeeId: updateData.employeeId } 
      });
      if (existingEmployee) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }
    }

    if (updateData.email && updateData.email !== employee.user.email) {
      const existingUser = await User.findOne({ 
        where: { email: updateData.email } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update user data
    if (Object.keys(userData).length > 0) {
      await employee.user.update(userData, { transaction });
    }

    // Update employee data
    if (Object.keys(employeeData).length > 0) {
      await employee.update(employeeData, { transaction });
    }

    await transaction.commit();

    // Get updated employee with user info
    const updatedEmployee = await Employee.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] }
      }]
    });

    res.status(200).json({
      data: { employee: updatedEmployee },
      succeeded: true,
      message: 'Employee updated successfully',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete employee record (user will be deleted due to CASCADE)
    await employee.destroy({ transaction });
    
    // Also delete the user
    await User.destroy({ where: { id: employee.userId }, transaction });

    await transaction.commit();

    res.status(200).json({
      succeeded: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

// Get current employee's profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{
        model: Employee,
        as: 'employeeProfile',
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.employeeProfile) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    res.status(200).json({
      data: { employee: user.employeeProfile, user: user },
      succeeded: true,
      message: 'Employee profile retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting employee profile:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getMyProfile,
  getUsersWithoutEmployeeRecords,
};