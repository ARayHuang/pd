const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const {
	prepareManagedUser,
	hasPermissionToManageUser,
} = require('../../user.common');

exports.before = compose([
	validateRequestPayload,
	prepareManagedUser,
	hasPermissionToManageUser,
]);
