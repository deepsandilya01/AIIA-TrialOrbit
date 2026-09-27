import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userRepository from '../repositories/user.repository.js';
import env from '../config/env.js';

import { getRedisClient } from '../config/redis.js';

class AuthService {
  async register(userData) {
    // Normalize email
    const email = (userData.email || '').trim().toLowerCase();
    if (!email) throw new Error('Email is required');

    // Prevent public registration from escalating to privileged roles
    const PRIVILEGED_ROLES = ['ADMIN', 'REGULATOR'];
    const requestedRole = userData.role || 'PI';
    if (PRIVILEGED_ROLES.includes(requestedRole)) {
      throw new Error('Public registration is not permitted for this role. Contact your system administrator.');
    }

    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    // Create user
    const newUser = await userRepository.create({
      email,
      passwordHash,
      name: userData.name,
      role: requestedRole,
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

  async logout(token) {
    const redis = getRedisClient();
    if (!redis) return; // if redis is down, just rely on client clearing token

    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.jti && decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;
        if (ttl > 0) {
          await redis.set(`auth:blacklist:${decoded.jti}`, 'revoked', { EX: ttl });
        }
      }
    } catch (err) {
      console.error('Logout revocation failed:', err.message);
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('Current and new passwords are required');
    }
    
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters');
    }

    const user = await userRepository.findByEmailWithPassword((await userRepository.findById(userId)).email);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) throw new Error('Invalid current password');

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    user.passwordHash = passwordHash;
    await user.save();
  }

  generateToken(user) {
    return jwt.sign(
      { sub: user._id, id: user._id, role: user.role, siteId: user.siteId },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn, jwtid: crypto.randomUUID() }
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

export default new AuthService();
