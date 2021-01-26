const paramRule = /:(\w+)/g;

export const paramReplace = (text, params = {}) => {
	return text.replace(paramRule, (_, key) => (params[key] || key));
};

export function getRouteMetaConfig(config) {
	return Object.assign({}, {
		breadcrumbName: '',
		isCrumbActive: true,
		isCrumbVisible: true,
		pageTitle: '',
		pageDescription: '',
		isBannerVisible: true,
	}, config);
}

export function getUpdatedMeta(updatedKeys, data) {
	let result = {};

	if (!updatedKeys) {
		return result;
	}

	Object.keys(updatedKeys).forEach(key => {
		const _data = data[updatedKeys[key]];

		if (_data !== undefined && _data !== null) {
			result[key] = _data;
		}
	});

	return result;
}
