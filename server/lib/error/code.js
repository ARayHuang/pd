module.exports = {
	// CHANNEL
	CHANNEL_IS_EXCEEDED: {
		CODE: '888.003.403',
		MESSAGE: '团队数量已达上限',
	},
	CHANNEL_NOT_FOUND: {
		CODE: '888.003.404',
		MESSAGE: '找不到团队',
	},
	CHANNEL_DUPLICATED: {
		CODE: '888.003.409',
		MESSAGE: '团队已存在',
	},
	CHANNEL_INVALID_REQUEST: {
		CODE: '888.003.422',
		MESSAGE: '输入格式错误',
	},
	// TAG
	TAG_IS_EXCEEDED: {
		CODE: '888.004.403',
		MESSAGE: '标签数量已达上限',
	},
	TAG_NOT_FOUND: {
		CODE: '888.004.404',
		MESSAGE: '找不到标签',
	},
	TAG_DUPLICATED: {
		CODE: '888.004.409',
		MESSAGE: '标签已存在',
	},
	TAG_INVALID_REQUEST: {
		CODE: '888.004.422',
		MESSAGE: '输入格式错误',
	},
	// ORDER
	ORDER_IS_FORBIDDEN: {
		CODE: '888.005.403',
		MESSAGE: '用户无权限操作',
	},
	ORDER_NOT_FOUND: {
		CODE: '888.005.404',
		MESSAGE: '找不到派单',
	},
	ORDER_COMMENT_IS_EXCEEDED: {
		CODE: '888.005.405',
		MESSAGE: '此派单留言数量已达上限',
	},
	ORDER_FILE_IS_EXCEEDED: {
		CODE: '888.005.406',
		MESSAGE: '此派单附件数量已达上限',
	},
	ORDER_FILE_NOT_FOUND: {
		CODE: '888.005.407',
		MESSAGE: '找不到附件',
	},
	ORDER_INVITATION_NOT_FOUND: {
		CODE: '888.005.408',
		MESSAGE: '找不到邀请',
	},
	ORDER_CO_OWNER_DUPLICATED: {
		CODE: '888.005.409',
		MESSAGE: '开单协作者已存在',
	},
	ORDER_CO_HANDLER_DUPLICATED: {
		CODE: '888.005.410',
		MESSAGE: '接单协作者已存在',
	},
	ORDER_INVALID_REQUEST: {
		CODE: '888.005.422',
		MESSAGE: '输入格式错误',
	},
	// SOCKET
	SOCKET_INVALID_REQUEST: {
		CODE: '888.006.422',
		MESSAGE: '输入格式错误',
	},
	// AUTH
	INVALID_LOGIN_CREDENTIALS: {
		CODE: '888.010.401',
		MESSAGE: '帐密错误',
	},
	WITHOUT_LOGGED_IN: {
		CODE: '888.010.402',
		MESSAGE: '请先登入',
	},
	INVALID_AUTH_REQUEST: {
		CODE: '888.010.422',
		MESSAGE: '输入格式错误',
	},
	// USER
	USER_IS_BLOCKED: {
		CODE: '888.012.402',
		MESSAGE: '帐户被冻结',
	},
	USER_NOT_FOUND: {
		CODE: '888.012.404',
		MESSAGE: '用户不存在',
	},
	USER_IS_FORBIDDEN: {
		CODE: '888.012.405',
		MESSAGE: '用户无此权限',
	},
	USER_DUPLICATED: {
		CODE: '888.012.409',
		MESSAGE: '帐号已存在',
	},
	USER_INVALID_REQUEST: {
		CODE: '888.012.422',
		MESSAGE: '输入格式错误',
	},
};
