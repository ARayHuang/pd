import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import isNaN from 'lodash/isNaN';
import isNull from 'lodash/isNull';
import isEqual from 'lodash/isEqual';

export const objectFilterOptionEnums = {
	SKIP_NULL: 'skipNull',
	SKIP_UNDEFINED: 'skipUndefined',
	SKIP_NAN: 'skipNan',
	SKIP_EMPTY_STRING: 'skipEmptyString',
};

const {
	SKIP_NULL,
	SKIP_UNDEFINED,
	SKIP_NAN,
	SKIP_EMPTY_STRING,
} = objectFilterOptionEnums;

export function objectFilter(object = {}, options = []) {
	if (!isEqual(Object.prototype.toString.call(object), '[object Object]')) {
		return object;
	}

	if (!isEqual(Object.prototype.toString.call(options), '[object Array]')) {
		return object;
	}

	function getOmitPredicate(option) {
		switch (option) {
			case SKIP_NULL: {
				return isNull;
			}

			case SKIP_UNDEFINED: {
				return isUndefined;
			}

			case SKIP_NAN: {
				return isNaN;
			}

			case SKIP_EMPTY_STRING: {
				return value => value === '';
			}

			default:
				return false;
		}
	}

	let newObject = Object.assign({}, object);

	options.forEach(option => {
		const omitPredicate = getOmitPredicate(option);

		newObject = omitBy(newObject, omitPredicate);
	});

	return newObject;
}

export function isObjectEmpty(obj) {
	for (let key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] !== 'undefined') {
			return false;
		}
	}

	return true;
}
