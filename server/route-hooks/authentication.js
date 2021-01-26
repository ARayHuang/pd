const passport = require('../passport');

function authenticateLoginCredentials(req, res, next) {
	const strategy = passport.LOGIN_STRATEGY.PASSWORD;

	return passport.authenticateCredentials(strategy, req, res, next);
}

module.exports = {
	authenticateLoginCredentials,
};
