const pool = require('../config/pool');

async function addUser({ firstName, lastName, email, hashedPass, admin }) {
	await pool.query(`
		INSERT INTO users
		(first_name, last_name, email, password, admin)
		VALUES ($1, $2, $3, $4, $5)
		`, 
		[firstName, lastName, email, hashedPass, admin]
	);
};

async function addPost({ title, body, userId }) {
	await pool.query(`
		INSERT INTO messages
		(title, text, user_id)
		VALUES ($1, $2, $3)
		`, 
		[title, body, userId]
	);
};

async function addMembership(userId) {
	await pool.query(`
		UPDATE users
		SET member = true
		WHERE users.id = $1
		`, [userId]
	);
};

async function getAllPosts() {
	const { rows } = await pool.query(`
		SELECT
			messages.id,
			title,
			text,
			added,
			first_name,
			last_name,
			member,
			admin
		FROM messages
		INNER JOIN users 
		ON messages.user_id = users.id
	`);
	return rows;
};

module.exports = {
	addUser,
	addPost,
	addMembership,
	getAllPosts,
};
