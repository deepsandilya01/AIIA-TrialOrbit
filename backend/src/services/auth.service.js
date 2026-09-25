const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const env = require('../config/env');

class AuthService {
  async register(userData) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    // Create user
    const newUser = await userRepository.create({
      email: userData.email,
      passwordHash,
      name: userData.name,
      role: userData.role || 'PI', // Default for now
      siteId: userData.siteId
    });

    const token = this.generateToken(newUser);
    return { user: this.sanitizeUser(newUser), token };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    const user = await userRepository.findByEmailWithPassword(email);
    if (!user || !user.isActive) {
      throw new Error('Invalid credentials or inactive account');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }
    return this.sanitizeUser(user);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role, siteId: user.siteId },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );
  }

  sanitizeUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      siteId: user.siteId,
      isActive: user.isActive
    };
  }
}

module.exports = new AuthService();
