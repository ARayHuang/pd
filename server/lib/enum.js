const ENUM_USER_TYPE = {
	ADMIN: 'admin',
	MANAGER: 'manager',
	STAFF: 'staff',
};
const ENUM_USER_STATUS = {
	ACTIVE: 'active',
	ARCHIVED: 'archived',
};
const ENUM_USER_DEPARTMENT = {
	// 開單組
	PROVIDER: 'provider',
	// 接單組
	CONSUMER: 'consumer',
};
const ENUM_USER_SHIFT = {
	// 早班
	MORNING: 'morning',
	// 中
	NOON: 'noon',
	// 晚班
	NIGHT: 'night',
};
const ENUM_USER_PROFILE_PICTURE_ID = {
	AVATAR_1: '1',
	AVATAR_2: '2',
	AVATAR_3: '3',
	AVATAR_4: '4',
	AVATAR_5: '5',
	AVATAR_6: '6',
};
const ENUM_CHANNEL_STATUS = {
	ACTIVE: 'active',
	ARCHIVED: 'archived',
};
const ENUM_TAG_STATUS = {
	ACTIVE: 'active',
	DISABLED: 'disabled',
	ARCHIVED: 'archived',
};
const ENUM_ORDER_STATUS = {
	CREATED: 'created',
	ACCEPTED: 'accepted',
	RESOLVED: 'resolved',
	TRACKED: 'tracked',
	COMPLETED: 'completed',
	DELETED: 'deleted',
};
const ENUM_ORDER_FILE_TYPE = {
	IMAGE: 'image',
	VIDEO: 'video',
};
const ENUM_TASK_NAME = {
	CLEAN_EXPIRED_ORDERS: 'clean-expired-orders',
};
const ENUM_PUBLISH_TYPE = {
	REPORT_USERS: 'report-users',
	PUB_CREATED_ORDER: 'pub-created-order',
	PUB_UPDATED_ORDER: 'pub-updated-order',
	PUB_CREATED_ORDER_COMMENT: 'pub-created-order-comment',
	PUB_CREATED_ORDER_FILE: 'pub-created-order-file',
	PUB_CREATED_CHANNEL: 'pub-created-channel',
	PUB_UPDATED_CHANNEL: 'pub-updated-channel',
	PUB_DELETED_CHANNEL: 'pub-deleted-channel',
	PUB_UPDATED_USER_CHANNELS: 'pub-updated-user-channels',
	PUB_UPDATED_TAGS: 'pub-updated-tags',
	PUB_UPDATED_ORDER_HAS_NEW_ACTIVITY: 'pub-updated-order-has-new-activity',
	PUB_CREATED_INVITATION: 'pub-created-invitation',
	PUB_UPDATED_INVITATION: 'pub-updated-invitation',
};
const ENUM_SOCKET_EVENT = {
	RESPONSE: 'RESPONSE',
	SUBSCRIBE_ORDER: 'ORDER.SUBSCRIBE',
	UNSUBSCRIBE_ORDER: 'ORDER.UNSUBSCRIBE',
	CREATED_ORDER: 'ORDER.CREATED',
	UPDATED_ORDER: 'ORDER.UPDATED',
	CREATED_ORDER_COMMENT: 'ORDER.COMMENT.CREATED',
	CREATED_ORDER_FILE: 'ORDER.FILE.CREATED',
	UPDATED_CHANNELS: 'CHANNELS.UPDATED',
	UPDATED_TAGS: 'TAGS.UPDATED',
	UPDATED_ORDER_HAS_NEW_ACTIVITY: 'ORDER.HAS-NEW-ACTIVITY.UPDATED',
	CREATED_INVITATION: 'INVITATION.CREATED',
	UPDATED_INVITATION: 'INVITATION.UPDATED',
};
const ENUM_LOG_TYPE = {
	CREATED_ORDER: 'created-order',
	ACCEPTED_ORDER: 'accepted-order',
	RESOLVED_ORDER: 'resolved-order',
	TRACKED_ORDER: 'tracked-order',
	COMPLETED_ORDER: 'completed-order',
	DELETED_ORDER: 'deleted-order',
	TRANSFERRED_ORDER: 'transferred-order',
	INVITED_USER_INTO_ORDER: 'invited-user-into-order',
	UPDATED_ORDER_DESCRIPTION: 'updated-order-description',
};
const ENUM_ORDER_OPERATION_TYPE = {
	SUBSCRIBED_ORDER: 'subscribed-order',
	READ_ORDER: 'read-order',
	CREATED_COMMENT: 'created-comment',
	CREATED_FILE: 'created-file',
	UPDATED_DESCRIPTION: 'updated-description',
};
const ENUM_INVITATION_STATUS = {
	CREATED: 'created',
	ACCEPTED: 'accepted',
	REJECTED: 'rejected',
};
const ENUM_INVITATION_TYPE = {
	CO_OWNER: 'co-owner',
	CO_HANDLER: 'co-handler',
	TRANSFERRED_OWNER: 'transferred-owner',
	TRANSFERRED_HANDLER: 'transferred-handler',
};

module.exports = {
	ENUM_USER_TYPE,
	ENUM_USER_STATUS,
	ENUM_USER_DEPARTMENT,
	ENUM_USER_SHIFT,
	ENUM_USER_PROFILE_PICTURE_ID,
	ENUM_CHANNEL_STATUS,
	ENUM_TAG_STATUS,
	ENUM_ORDER_STATUS,
	ENUM_ORDER_FILE_TYPE,
	ENUM_TASK_NAME,
	ENUM_PUBLISH_TYPE,
	ENUM_SOCKET_EVENT,
	ENUM_LOG_TYPE,
	ENUM_ORDER_OPERATION_TYPE,
	ENUM_INVITATION_STATUS,
	ENUM_INVITATION_TYPE,
};
