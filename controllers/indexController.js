const asyncHandler = require('express-async-handler');
const db = require('../db/queries');
const { body, validationResult } = require('express-validator');

const validatePost = [
	body('title').trim()
		.notEmpty().withMessage('Title cannot be empty.')
		.isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 30 characters.'),
	body('body').trim()
		.notEmpty().withMessage('Body cannot be empty.'),
];

const indexGet = asyncHandler(async (req, res) => {
	const posts = await db.getAllPosts();
	res.render('index', {
		user: req.user,
		posts
	});
});

const postGet = (req, res) => {
	res.render('post');
};

const postPost = [
	validatePost,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).render('post', {
				errors: errors.array()
			});
		};
		
		const { title, body } = req.body;
		const userId = req.user.id;
		await db.addPost({ title, body, userId });
		res.redirect('/');
	})
];

module.exports = {
	indexGet,
	postGet,
	postPost,
};
