const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const { validateUserType } = require('../../user.common');
const { ENUM_USER_TYPE } = require('../../../../lib/enum');

exports.before = compose([
	validateRequestPayload,
	validateUserType([ENUM_USER_TYPE.ADMIN]),
]);
