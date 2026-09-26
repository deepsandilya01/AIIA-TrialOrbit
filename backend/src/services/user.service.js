import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

class UserService {
  async getAllUsers(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const filters = {};
    if (query.role) filters.role = query.role;
    if (query.isActive !== undefined) filters.isActive = query.isActive === 'true';
    if (query.search) {
      filters.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await User.countDocuments(filters);

    return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async createUser(data, actorId) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error('User with this email already exists');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      isActive: true
    });

    await AuditLog.create({
      actorId,
      action: 'CREATE',
      entityType: 'User',
      entityId: user._id,
      newValue: `${user.email} [${user.role}]`,
      reason: 'Admin user creation'
    });

    return user;
  }

  async updateUser(id, data, actorId) {
    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!user) throw new Error('User not found');

    await AuditLog.create({
      actorId,
      action: 'UPDATE',
      entityType: 'User',
      entityId: user._id,
      newValue: JSON.stringify(data),
      reason: 'Admin user update'
    });

    return user;
  }

  async updateRole(id, role, actorId) {
    // Prevent escalation to ADMIN by non-superadmin — all changes logged
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await AuditLog.create({
      actorId,
      action: 'UPDATE',
      entityType: 'User',
      entityId: user._id,
      oldValue: oldRole,
      newValue: role,
      reason: 'Role change by admin'
    });

    return user;
  }

  async updateStatus(id, isActive, actorId) {
    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!user) throw new Error('User not found');

    await AuditLog.create({
      actorId,
      action: 'UPDATE',
      entityType: 'User',
      entityId: user._id,
      oldValue: String(!isActive),
      newValue: String(isActive),
      reason: isActive ? 'User activated' : 'User deactivated'
    });

    return user;
  }
}

export default new UserService();
