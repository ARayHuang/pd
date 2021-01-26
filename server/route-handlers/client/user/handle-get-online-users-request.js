const {
	publisher: { getOnlineUsers },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { channelId } = req.query;

	try {
		const onlineUsers = await getOnlineUsers({
			channelId,
			departmentType: req.user.departmentType,
		});
		const index = onlineUsers.findIndex(user => user.id === req.user.id);

		if (index >= 0) {
			onlineUsers.splice(index, 1);
		}

		res.status(200).json({
			data: onlineUsers,
			numOfItems: onlineUsers.length,
			numOfPages: onlineUsers.length > 0 ? 1 : 0,
		});
	} catch (error) {
		next(error);
	}
};
