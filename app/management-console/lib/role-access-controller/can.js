import PropTypes from 'prop-types';
import { checkRoleRules } from '../../../lib/role-rules-utils';
import { UserTypeEnums } from '../../../lib/enums';
import { rules } from '../../configs/role-access-config';

const {
	ADMIN,
	MANAGER,
	STAFF,
} = UserTypeEnums;
const propTypes = {
	role: PropTypes.oneOf([ADMIN, MANAGER, STAFF]),
	functionCode: PropTypes.string,
	dynamicArgs: PropTypes.any,
	renderPassed: PropTypes.func,
	renderDenied: PropTypes.func,
};
const Can = ({
	role,
	functionCode,
	dynamicArgs,
	renderPassed,
	renderDenied = () => null,
}) => {
	if (checkRoleRules(rules, role, functionCode, dynamicArgs)) {
		return renderPassed();
	}

	return renderDenied();
};

Can.propTypes = propTypes;

export default Can;
