const { Router } = require('express');
const authRouter = Router();
const authController = require('../controllers/authController');

authRouter.get('/sign-up', authController.createUserGet);
authRouter.post('/sign-up', authController.createUserPost);

module.exports = authRouter;
