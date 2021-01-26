export const checkRoleRules = (rules, role, functionCode, dynamicArgs) => {
	const permissions = rules[role];

	if (!permissions) {
		return false;
	}

	const {
		static: staticPermission,
		dynamic: dynamicPermission,
	} = permissions;

	if (staticPermission && staticPermission.indexOf(functionCode) !== -1) {
		return true;
	}

	if (dynamicPermission) {
		const condition = dynamicPermission[functionCode];

		if (!condition) {
			return false;
		}

		return condition(dynamicArgs);
	}

	return false;
};
