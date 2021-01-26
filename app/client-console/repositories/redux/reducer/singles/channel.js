import { Map } from 'immutable';
import { actionTypes } from '../../../../controller';

const {
	SET_SELECTED_CHANNEL,
} = actionTypes;
const initialState = Map({
	data: Map(),
});

/*
Example
data:
Map({
	id: '1234567',
	name: 'channel-1',
})
*/

export default function channel(state = initialState, action) {
	switch (action.type) {
		case SET_SELECTED_CHANNEL:
			return state.set('data', Map(action.channel));

		default:
			return state;
	}
}
