const asyncHandler = require('express-async-handler');
const db = require('../db/queries');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 30 characters.';

const validateUserRegistration = [
	body('firstName').trim()
		.isAlpha().withMessage(`First name ${alphaErr}`)
		.isLength({ min: 1, max: 30 }).withMessage(`First name ${lengthErr}`),
	body('lastName').trim()
		.isAlpha().withMessage(`Last name ${alphaErr}`)
		.isLength({ min: 1, max: 30 }).withMessage(`Last name ${lengthErr}`),
	body('email').normalizeEmail()
		.isEmail().withMessage('Email must be a valid email address.'),
	body('password').trim()
		.isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
	body('confirmPass').trim()
		.custom(async (value, { req }) => {
			if (value === req.body.password) {
				return true;
			}
			throw new Error('Confirm password must match the password.');
		}),
];

const validateUserLogin = [
	body('email').normalizeEmail()
		.isEmail().withMessage('Email must be a valid email address.'),
	body('password').trim()
		.notEmpty().withMessage('Password cannot be empty.'),
];

const createUserGet = (req, res) => {
	res.render('sign-up');
};

const createUserPost = [
	validateUserRegistration, 
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).render('sign-up', { 
				errors: errors.array() 
			});
		};
		
		const { firstName, lastName, email } = req.body;
		const hashedPass = await bcrypt.hash(req.body.password, 10);
		const admin = req.body.admin === 'on';
		await db.addUser({ firstName, lastName, email, hashedPass, admin });
		res.redirect('/');
})];

module.exports = {
	createUserGet,
	createUserPost,
};
