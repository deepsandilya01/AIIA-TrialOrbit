import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userRepository from '../repositories/user.repository.js';
import env from '../config/env.js';

import { getRedisClient } from '../config/redis.js';

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
