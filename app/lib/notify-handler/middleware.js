import {
	errorNotifications,
	successNotifications,
	infoNotifications,
} from './notifications';
import {
	createNotification,
	NotifyTypeEnum,
} from './utils';
import { CATCH_NOTIFY_HANDLER } from './notify-handler-action';

const {
	AjaxError,
	GeneralError,
} = errorNotifications;
const { Success } = successNotifications;
const { Info } = infoNotifications;
const {
	ERROR,
	SUCCESS,
	INFO,
} = NotifyTypeEnum;
const NOTIFY_DELAY_TIME = 5000;
const notifyHandlerMiddleware = () => next => action => {
	const { notification, type } = action;

	if (type === CATCH_NOTIFY_HANDLER) {
		handleNotify(notification);
	}

	return next(action);
};

function handleNotify(notification) {
	const { message } = notification;

	if (notification instanceof AjaxError) {
		createNotification(ERROR, message, NOTIFY_DELAY_TIME);
	}

	if (notification instanceof GeneralError) {
		createNotification(ERROR, message, NOTIFY_DELAY_TIME);
	}

	if (notification instanceof Success) {
		createNotification(SUCCESS, message, NOTIFY_DELAY_TIME);
	}

	if (notification instanceof Info) {
		createNotification(INFO, message, NOTIFY_DELAY_TIME);
	}
}

export default notifyHandlerMiddleware;
