module.exports = {
	beforeUpdateTagRequest: require('./update-tag-request').before,
	beforeGetTagRequest: require('./get-tag-request').before,
	beforeCreateTagRequest: require('./create-tag-request').before,
	beforeGetTagsRequest: require('./get-tags-request').before,
	beforeDeleteTagRequest: require('./delete-tag-request').before,
};
