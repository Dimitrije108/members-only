const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sessionStore = require('./sessionStore');
const bcrypt = require('bcryptjs');
const pool = require('./pool');

const sessionInit = session({ 
	secret: 'randomString', 
	resave: false, 
	saveUninitialized: false,
	store: sessionStore,
	cookie: { maxAge: 24 * 60 * 60 * 1000 },
});

const passportInit = passport.session();

const localStrategy = new LocalStrategy(async (username, password, done) => {
	try {
		const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
		const user = rows[0];
		// Check if user exists
		if (!user) {
			return done(null, false, { message: "Incorrect username" });
		}
		// Check user password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return done(null, false, { message: "Incorrect password" });
		}
		return done(null, user);
	} catch(err) {
		return done(err);
	}
});

passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

module.exports = {
	sessionInit,
	passportInit
};
