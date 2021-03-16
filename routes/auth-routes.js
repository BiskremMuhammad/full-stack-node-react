const { Router } = require('express');
const authController = require('../controllers/auth-controller');

const authRouter = Router();

authRouter.post('/login', authController.post_login);
authRouter.post('/signup', authController.post_signup);
authRouter.post('/verify', authController.verify_auth);

module.exports = authRouter;