import {
	isConfigRequired,
	merge,
} from './utils';

const noBodyMethods = ['get', 'head'];
const withBodyMethods = ['post', 'put', 'patch', 'delete'];
const DEFAULT_CONTENT_TYPE = {
	'Content-Type': 'application/json',
};
const defaultConfigs = {
	baseUrl: '',
	method: 'GET',
	headers: {
		Accept: 'application/json',
	},
	fetcher: undefined,
};

function generateApiFetcher(initialConfigs = {}) {
	const _defaults = merge(defaultConfigs, initialConfigs);
	const {
		fetcher: _fetcher = isConfigRequired('fetcher'),
	} = _defaults;
	const handlers = {};
	const _request = configs => {
		const finalConfigs = merge({}, _defaults, configs);

		finalConfigs.method = finalConfigs.method.toUpperCase();

		return _fetcher(finalConfigs);
	};

	noBodyMethods.forEach(method => {
		handlers[method] = (url, configs = {}) => {
			return _request(merge(configs, {
				url,
				method,
			}));
		};
	});
	withBodyMethods.forEach(method => {
		handlers[method] = (url, body, configs = {}) => {
			return _request(merge({
				headers: DEFAULT_CONTENT_TYPE,
			}, configs, {
				url,
				body,
				method,
			}));
		};
	});

	return handlers;
}

export default generateApiFetcher;
