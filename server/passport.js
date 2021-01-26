const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {
	INVALID_LOGIN_CREDENTIALS,
	USER_NOT_FOUND,
} = require('./lib/error/code');
const {
	AuthenticationError,
} = require('ljit-error');
const {
	getActiveUserById,
	getActiveUserByUsername,
} = require('./services/user');
const LOGIN_STRATEGY = {
	PASSWORD: 'password',
};

function initialize() {
	setPasswordLoginStrategy();
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser(async (userId, done) => {
		try {
			const user = await getActiveUserById(userId);

			done(null, user);
		} catch (error) {
			done(error, null);
		}
	});
	return passport.initialize();
}

function session() {
	return passport.session();
}

function authenticateCredentials(strategy, req, res, next) {
	const cb = function (error, user) {
		if (error) {
			return next(error);
		}

		req.login(user, error => {
			if (error) {
				return next(error);
			}

			res.locals.user = {
				id: user.id,
				username: user.username,
			};
			next();
		});
	};

	return passport.authenticate(strategy, cb)(req, res, next);
}

function setPasswordLoginStrategy() {
	const strategy = new LocalStrategy(
		{ passReqToCallback: true },
		async (req, username, password, done) => {
			try {
				const user = await getActiveUserByUsername(username);

				if (user === null) {
					throw new AuthenticationError(INVALID_LOGIN_CREDENTIALS.MESSAGE, USER_NOT_FOUND.CODE);
				}

				if (!user.isValidPassword(password)) {
					throw new AuthenticationError(INVALID_LOGIN_CREDENTIALS.MESSAGE, INVALID_LOGIN_CREDENTIALS.CODE);
				}

				done(null, user);
			} catch (error) {
				done(error);
			}
		},
	);

	passport.use(LOGIN_STRATEGY.PASSWORD, strategy);
}

module.exports = {
	LOGIN_STRATEGY,
	session,
	initialize,
	authenticateCredentials,
};
