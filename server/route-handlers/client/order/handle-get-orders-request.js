const { getOrdersWithinStatusAndPagination } = require('../../../services/order');

module.exports = async (req, res, next) => {
	const {
		page, limit, sort,
		order, from, to,
		description, handlerId, customerName,
		status,
	} = req.query;
	const { channelIds } = res.locals;

	try {
		const result = await getOrdersWithinStatusAndPagination({ status, page }, {
			description,
			handlerId,
			customerName,
			channelIds,
			myUserId: req.user._id,
		}, {
			from,
			to,
			limit,
			sort,
			order,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
