export const CATCH_NOTIFY_HANDLER = 'CATCH_NOTIFY_HANDLER';

export function notifyHandlerAction(notification) {
	return {
		type: CATCH_NOTIFY_HANDLER,
		notification,
	};
}
