import React from 'react';
import PropTypes from 'prop-types';
import { checkRoleRules } from '../../../lib/role-rules-utils';
import { UserTypeEnums, DepartmentTypeEnums } from '../../../lib/enums';
import { rules } from '../../configs/role-access-config';

const {
	ADMIN,
	MANAGER,
	STAFF,
} = UserTypeEnums;
const {
	PROVIDER,
	CONSUMER,
} = DepartmentTypeEnums;
const propTypes = {
	onNavigate: PropTypes.func,
	userType: PropTypes.oneOf([ADMIN, MANAGER, STAFF]),
	me: PropTypes.shape({
		type: PropTypes.oneOf([ADMIN, MANAGER, STAFF]),
		departmentType: PropTypes.oneOf([PROVIDER, CONSUMER]),
	}),
};
const withRoleRule = functionCode => WrappedComponent => {
	const WithRoleRuleComponent = props => {
		const {
			onNavigate,
			me: {
				type,
				departmentType,
			},
			...rest
		} = props;

		if (!checkRoleRules(rules, type, functionCode, { departmentType })) {
			onNavigate('/');

			return null;
		}

		return (
			<WrappedComponent
				onNavigate={onNavigate}
				{...rest}
			/>
		);
	};

	WithRoleRuleComponent.propTypes = propTypes;
	WithRoleRuleComponent.displayName = `withRoleRule(${getDisplayName(WrappedComponent)})`;

	return WithRoleRuleComponent;
};

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withRoleRule;
