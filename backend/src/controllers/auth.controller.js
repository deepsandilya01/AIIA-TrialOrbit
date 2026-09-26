import authService from '../services/auth.service.js';

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
