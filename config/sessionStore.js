const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./pool');

module.exports = new pgSession({
	pool: pool,
	createTableIfMissing: true,
});
