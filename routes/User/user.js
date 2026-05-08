const express = require('express');
const {
  registerController,
  loginController,
  logoutController,
  refreshAccessTokenController
} = require('../../controllers/Auth/user');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshAccessTokenController);

module.exports = router;