import {
	notifications,
	notifyHandlerActions,
} from '../../../lib/notify-handler';

const {
	errorNotifications: {
		AjaxError,
	},
	successNotifications: {
		Success,
	},
} = notifications;
const {
	notifyHandlerAction,
} = notifyHandlerActions;

export function notifyErrorAction(error, errorMessage) {
	return notifyHandlerAction(new AjaxError(errorMessage));
}

export function notifySuccessAction(message) {
	return notifyHandlerAction(new Success(message));
}
