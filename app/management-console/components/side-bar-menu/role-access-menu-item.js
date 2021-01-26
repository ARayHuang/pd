import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'ljit-react-components';
import { Can } from '../../lib/role-access-controller';
import { UserTypeEnums } from '../../../lib/enums';

const {
	ADMIN,
	MANAGER,
	STAFF,
} = UserTypeEnums;
const { Item } = Menu;
const propTypes = {
	role: PropTypes.oneOf([ADMIN, MANAGER, STAFF]),
	functionCode: PropTypes.string.isRequired,
	dynamicArgs: PropTypes.any,
	children: PropTypes.any,
};
const RoleRulesMenuItem = ({
	role,
	functionCode,
	children,
	dynamicArgs,
	...rest
}) => (
	<Can
		role={role}
		functionCode={functionCode}
		dynamicArgs={dynamicArgs}
		renderPassed={() => (
			<Item
				{...rest}
			>
				{children}
			</Item>
		)}
	/>
);

RoleRulesMenuItem.propTypes = propTypes;

export default RoleRulesMenuItem;
