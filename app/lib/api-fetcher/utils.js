import _merge from 'lodash/merge';
import { getQueryString } from 'ljit-lib/qs-utils';

const NAME = 'api-fetcher';

export const isConfigRequired = (configName = '') => {
	throw new Error(`[${NAME}]: ${configName} is required`);
};

export const merge = (...args) => _merge(...args);

/* eslint-disable */
// Explain: because eslint will judge '\+' and '\.' as error express, but for regular express is work.
export const isAbsoluteUrl = url => /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
/* eslint-enable */

export const combineUrls = (baseUrl = '', relativeUrl = '') => {
	return baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '');
};

export const buildFullPath = (baseUrl = '', relativeUrl = '') => {
	if (baseUrl && !isAbsoluteUrl(relativeUrl)) {
		return combineUrls(baseUrl, relativeUrl);
	}

	return relativeUrl;
};

export const buildUrl = (url, queries) => {
	let _url = url;

	if (!queries) {
		return _url;
	}

	const queryStrings = getQueryString(queries);

	if (queryStrings) {
		const connectTag = _url.indexOf('?') < 0 ? '?' : '&';

		_url += connectTag + queryStrings;
	}

	return _url;
};
