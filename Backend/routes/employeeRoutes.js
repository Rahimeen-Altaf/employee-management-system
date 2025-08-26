const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getMyProfile,
  getUsersWithoutEmployeeRecords,
} = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/auth');

// Employee routes (protected by authentication)
router.get('/profile', protect, getMyProfile);

// Admin only routes
router.get('/', protect, adminOnly, getEmployees);
router.get('/users-without-employee-records', protect, adminOnly, getUsersWithoutEmployeeRecords);
router.get('/:id', protect, adminOnly, getEmployee);
router.post('/', protect, adminOnly, createEmployee);
router.put('/:id', protect, adminOnly, updateEmployee);
router.delete('/:id', protect, adminOnly, deleteEmployee);

module.exports = router;