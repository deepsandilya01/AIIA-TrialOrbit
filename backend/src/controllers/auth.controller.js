const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
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

exports.login = async (req, res, next) => {
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

exports.getMe = async (req, res, next) => {
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

exports.logout = async (req, res, next) => {
  try {
    // With JWT, logout is mostly handled client-side by deleting the token.
    // If using cookies, we would clear the cookie here.
    res.status(200).json({
      success: true,
      data: {},
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
