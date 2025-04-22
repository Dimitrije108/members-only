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

module.exports = {
	addUser,
};
