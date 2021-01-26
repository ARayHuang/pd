import {
	START_UPLOAD_FILE,
	UPLOAD_FILE_SUCCESS,
	UPLOAD_FILE_FAILED,
} from './action-types';

export function uploadFileAction(channelId, orderId, file) {
	return {
		type: START_UPLOAD_FILE,
		channelId,
		orderId,
		file,
	};
}

export function uploadFileSuccessAction() {
	return {
		type: UPLOAD_FILE_SUCCESS,
	};
}

export function uploadFileFailedAction(error, errorMessage) {
	return {
		type: UPLOAD_FILE_FAILED,
		error,
		errorMessage,
	};
}
