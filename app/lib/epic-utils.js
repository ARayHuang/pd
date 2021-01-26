export function getMessageFromResponse(payload, defaultMessage = '请稍后再试') {
	try {
		return payload.response.message;
	} catch (e) {
		console.log(e);
	}

	return defaultMessage;
}

export function catchErrorMessageForEpics(error, ...callbacks) {
	const errorMessage = getMessageFromResponse(error, '请稍后再试。');

	return callbacks.map(callback => callback(error, errorMessage));
}
