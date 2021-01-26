import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import {
	switchMap,
	map,
	catchError,
} from 'rxjs/operators';
import {
	catchErrorMessageForEpics,
} from '../../../../lib/epic-utils';
import {
	actionTypes,
	fileActions,
	notifyActions,
} from '../../../controller';
import { getAPIBaseUrl } from '../../../lib/general-utils';

const { START_UPLOAD_FILE } = actionTypes;
const {
	uploadFileSuccessAction,
	uploadFileFailedAction,
} = fileActions;
const {
	notifyErrorAction,
} = notifyActions;
const API_BASE_URL = getAPIBaseUrl();

export function uploadFileEpic(action$) {
	return action$.pipe(
		ofType(START_UPLOAD_FILE),
		switchMap(({ channelId, orderId, file } = {}) => {
			const formFile = new FormData();

			formFile.append('file', file);

			return ajax({
				url: `${API_BASE_URL}/channels/id=${channelId}/orders/id=${orderId}/files`,
				method: 'POST',
				headers: { Accept: 'application/json' },
				mimeType: 'multipart/form-data',
				body: formFile,
			}).pipe(
				map(payload => uploadFileSuccessAction(payload.response)),
				catchError(error => catchErrorMessageForEpics(error, uploadFileFailedAction, notifyErrorAction)),
			);
		}),
	);
}
