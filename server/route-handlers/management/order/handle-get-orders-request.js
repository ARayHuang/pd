const {
	getOrdersWithinStatusAndPagination,
} = require('../../../services/order');

module.exports = async (req, res, next) => {
	const {
		description, customerName, limit,
		order, sort, page,
		from, to, channelName,
	} = req.query;

	try {
		const result = await getOrdersWithinStatusAndPagination(
			{ page },
			{
				channelName,
				description,
				customerName,
			},
			{
				limit,
				order,
				sort,
				from,
				to,
			},
		);

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
