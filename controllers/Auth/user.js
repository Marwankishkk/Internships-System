const userService = require('../../services/User/userService.js');

// REGISTER
const registerController = async (req, res) => {
  try {
    const result = await userService.register(req.body);

    return res.status(201).json({
      message: "User created successfully",
      data: result
    });  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

// LOGIN
const loginController = async (req, res) => {
    try {
      const result = await userService.login(req.body);
  
      // Access Token (short-lived)
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 15 * 60 * 1000 // 15 min
      });
  
      // Refresh Token (long-lived)
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
  
      return res.status(200).json({
        message: "Login successful",
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
  
    } catch (error) {
      return res.status(401).json({
        message: error.message
      });
    }
  };

// REFRESH
const refreshAccessTokenController = (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    const result = userService.refreshAccessToken(token);

    return res.status(200).json({
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken
      }
    });


  } catch (error) {
    return res.status(401).json({
      message: error.message
    });
  }
};

// LOGOUT
const logoutController = (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  return res.status(200).json({
    message: "Logout successful"
  });
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  refreshAccessTokenController
};