const {
	LOG_PROJECTIONS,

	getLogsByOrderIdAndPagination,
} = require('../../../services/log');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;
	const {
		limit, page, order,
		sort,
	} = req.query;

	try {
		const result = await getLogsByOrderIdAndPagination(orderId, page, {
			limit,
			order,
			sort,
			projections: LOG_PROJECTIONS.LOG,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
