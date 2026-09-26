import userService from '../services/user.service.js';

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
