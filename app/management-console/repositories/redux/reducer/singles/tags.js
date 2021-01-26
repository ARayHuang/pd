import { Map, List } from 'immutable';
import { LoadingStatusEnum } from '../../../../../lib/enums';
import { actionTypes } from '../../../../controller';

const { NONE, LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const {
	START_FETCH_TAGS,
	FETCH_TAGS_SUCCESS,
	FETCH_TAGS_FAILED,
	START_CREATE_TAG,
	CREATE_TAG_SUCCESS,
	CREATE_TAG_FAILED,
	START_UPDATE_TAG,
	UPDATE_TAG_SUCCESS,
	UPDATE_TAG_FAILED,
	START_DELETE_TAG,
	DELETE_TAG_SUCCESS,
	DELETE_TAG_FAILED,
} = actionTypes;
// Example
// Map({
// 	"data": Map({
// 		"tags": List([
// 			{
// 				"id": "5ec5f60b25fbb049dbd231e2",
// 				"name": "標籤一",
// 				"backgroundColor": "FBC8D9",
// 				"fontColor": "CD349D"
// 				/*
// 					CSS Color Hex Code
// 					*/
// 				"status": "active"
// 				/*
// 					active: 可選擇
// 					disabled: 不可選擇
// 					*/
// 			}
// 		]),
// 		"numOfItems": 3,
// 		"numOfPages": 1,
// 	})
// })
const initialState = Map({
	data: Map({
		tags: List(),
		numOfItems: 0,
		numOfPages: 1,
	}),

	loadingStatus: NONE,
	loadingStatusMessage: '',
	createLoadingStatus: NONE,
	createLoadingStatusMessage: '',
	updateLoadingStatus: NONE,
	updateLoadingStatusMessage: '',
	deleteLoadingStatus: NONE,
	deleteLoadingStatusMessage: '',
});

export default function tags(state = initialState, action) {
	switch (action.type) {
		case START_FETCH_TAGS:
			return state.set('loadingStatus', LOADING);

		case FETCH_TAGS_SUCCESS: {
			const {
				tags,
				numOfItems,
			} = action;

			return state
				.setIn(['data', 'tags'], List(tags))
				.setIn(['data', 'numOfItems'], numOfItems)
				.set('loadingStatus', SUCCESS);
		}

		case FETCH_TAGS_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		case START_CREATE_TAG:
			return state.set('createLoadingStatus', LOADING);

		case CREATE_TAG_SUCCESS: {
			const { tag } = action;
			const updatedTags = state
				.getIn(['data', 'tags'])
				.push(tag);
			const updateNumOfItems = state.getIn(['data', 'numOfItems']) + 1;

			return state
				.setIn(['data', 'tags'], updatedTags)
				.setIn(['data', 'numOfItems'], updateNumOfItems)
				.set('createLoadingStatus', SUCCESS);
		}

		case CREATE_TAG_FAILED:
			return state
				.set('createLoadingStatus', FAILED)
				.set('createLoadingStatusMessage', action.errorMessage);

		case START_UPDATE_TAG:
			return state.set('updateLoadingStatus', LOADING);

		case UPDATE_TAG_SUCCESS: {
			const { tagId, status } = action;
			const updatedTags = state
				.getIn(['data', 'tags'])
				.map(tag => {
					if (tag.id === tagId) {
						return Object.assign({}, tag, { status });
					}

					return tag;
				});

			return state
				.setIn(['data', 'tags'], updatedTags)
				.set('updateLoadingStatus', SUCCESS);
		}

		case UPDATE_TAG_FAILED:
			return state
				.set('updateLoadingStatus', FAILED)
				.set('updateLoadingStatusMessage', action.errorMessage);

		case START_DELETE_TAG:
			return state.set('deleteLoadingStatus', LOADING);

		case DELETE_TAG_SUCCESS: {
			const { tagId } = action;
			const updatedTags = state
				.getIn(['data', 'tags'])
				.filter(tag => tag.id !== tagId);

			return state
				.setIn(['data', 'tags'], updatedTags)
				.set('deleteLoadingStatus', SUCCESS);
		}

		case DELETE_TAG_FAILED:
			return state
				.set('deleteLoadingStatus', FAILED)
				.set('deleteLoadingStatusMessage', action.errorMessage);
		default:
			return state;
	}
}
