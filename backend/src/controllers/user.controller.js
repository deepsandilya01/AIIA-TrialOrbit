import userService from '../services/user.service.js';
import auditService from '../services/audit.service.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.status(200).json({ success: true, data: result.users, pagination: result.pagination });
  } catch (error) { next(error); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body, req.user.id);
    res.status(201).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const updateRole = async (req, res, next) => {
  try {
    const user = await userService.updateRole(req.params.id, req.body.role, req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const user = await userService.updateStatus(req.params.id, req.body.isActive, req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, institution, department, designation } = req.body;
    
    // Only allow updating these specific fields to prevent privilege escalation
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (institution) updates.institution = institution;
    if (department) updates.department = department;
    if (designation) updates.designation = designation;

    const user = await userService.updateUser(req.user.id, updates, req.user.id);

    await auditService.log({
      action: 'UPDATE',
      entityType: 'User',
      entityId: user._id,
      actorId: req.user.id,
      reason: 'User profile updated'
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
