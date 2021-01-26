import {
	START_INITIALIZE_CONSUMER_APPLICATION,
	INITIALIZE_CONSUMER_APPLICATION_SUCCESS,
	INITIALIZE_CONSUMER_APPLICATION_FAILED,
	START_INITIALIZE_PROVIDER_APPLICATION,
	INITIALIZE_PROVIDER_APPLICATION_SUCCESS,
	INITIALIZE_PROVIDER_APPLICATION_FAILED,
} from './action-types';

export function initializeConsumerApplicationAction() {
	return {
		type: START_INITIALIZE_CONSUMER_APPLICATION,
	};
}
export function initializeConsumerApplicationSuccessAction() {
	return {
		type: INITIALIZE_CONSUMER_APPLICATION_SUCCESS,
	};
}
export function initializeConsumerApplicationFailedAction(error, errorMessage) {
	return {
		type: INITIALIZE_CONSUMER_APPLICATION_FAILED,
		error,
		errorMessage,
	};
}

export function initializeProviderApplicationAction() {
	return {
		type: START_INITIALIZE_PROVIDER_APPLICATION,
	};
}
export function initializeProviderApplicationSuccessAction() {
	return {
		type: INITIALIZE_PROVIDER_APPLICATION_SUCCESS,
	};
}
export function initializeProviderApplicationFailedAction(error, errorMessage) {
	return {
		type: INITIALIZE_PROVIDER_APPLICATION_FAILED,
		error,
		errorMessage,
	};
}
