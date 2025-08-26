const { User, Employee } = require('../working-models');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Check if user already exists (by email)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create user (basic info only)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'employee' // Default role
    });

    // Don't generate token - user should login manually
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      data: {
        user: userResponse
      },
      succeeded: true,
      message: "User registered successfully. Please log in to continue."
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "An internal error occurred" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: Employee,
        as: 'employeeProfile'
      }]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    const token = generateToken(user.id);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      data: {
        user: userResponse,
        token
      },
      succeeded: true,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "An internal error occurred" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{
        model: Employee,
        as: 'employeeProfile'
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      data: { user },
      succeeded: true,
      message: "Profile retrieved successfully"
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ message: "An internal error occurred" });
  }
};

module.exports = {
  register,
  login,
  getProfile
};