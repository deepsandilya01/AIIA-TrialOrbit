import authService from '../services/auth.service.js';
import auditService from '../services/audit.service.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    // If it's a known error from service, we could handle it better. 
    // Sending it to next will let error.middleware handle it.
    if (error.message.includes('already exists')) {
      res.status(400);
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.message.includes('Invalid') || error.message.includes('provide')) {
      res.status(401);
    }
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await authService.logout(token);
    }
    res.status(200).json({
      success: true,
      data: {},
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);

    await auditService.log({
      action: 'UPDATE',
      entity: 'PASSWORD',
      entityId: req.user._id,
      user: req.user._id,
      details: 'User password changed'
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error.message.includes('password') || error.message.includes('Current and new')) return res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};
