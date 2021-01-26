const Validator = require('fastest-validator');
const validator = new Validator({
	useNewCustomCheckerFunction: true,
});

/**
 * @param {Array<string>} sortableFields
 * @returns {{limit: Object, sort: Object, page: Object, order: Object}}
 */
function generatePaginationSchema(sortableFields) {
	return {
		sort: {
			type: 'string',
			optional: true,
			enum: sortableFields,
		},
		order: {
			type: 'string',
			optional: true,
			enum: ['asc', 'desc'],
		},
		limit: {
			type: 'number',
			optional: true,
			min: 1,
			max: 500,
			convert: true,
			integer: true,
		},
		page: {
			type: 'number',
			optional: true,
			convert: true,
			integer: true,
			min: 1,
		},
	};
}

function generateIdSchema() {
	return {
		type: 'string',
		empty: false,
		pattern: /^[a-f0-9]{24}$/,
	};
}

function generateDateSchema() {
	return {
		type: 'date',
		empty: false,
		optional: true,
		convert: true,
	};
}

function checkParametersHasOneNotEmpty(parameters) {
	const result = Object.values(parameters).find(field => field !== undefined);

	if (result === undefined) {
		return Object.keys(parameters).map(field => {
			return {
				field,
				message: `The ${field} field is required.`,
			};
		});
	}

	return true;
}

module.exports = {
	validator,
	generatePaginationSchema,
	generateIdSchema,
	generateDateSchema,
	checkParametersHasOneNotEmpty,
};
