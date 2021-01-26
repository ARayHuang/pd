import {
	SET_SELECTED_CHANNEL,
} from './action-types';

export function setSelectedChannelAction(channel) {
	return {
		type: SET_SELECTED_CHANNEL,
		channel,
	};
}
