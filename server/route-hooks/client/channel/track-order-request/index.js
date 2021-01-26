const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const {
	validateUserDepartmentType,
	createLog,
} = require('../../../common');
const { ENUM_USER_DEPARTMENT } = require('../../../../lib/enum');

exports.before = compose([
	validateRequestPayload,
	validateUserDepartmentType(ENUM_USER_DEPARTMENT.PROVIDER),
]);

exports.after = compose([
	createLog,
]);
