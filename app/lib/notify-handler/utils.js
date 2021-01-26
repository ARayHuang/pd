import { Notify } from 'ljit-react-components';

export const NotifyTypeEnum = {
	INFO: 'info',
	ERROR: 'error',
	SUCCESS: 'success',
};

export function createNotification(type, message, delay) {
	return Notify[type](message, delay);
}
