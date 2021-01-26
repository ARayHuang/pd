const {
	CHANNEL_PROJECTIONS,

	getActiveChannelsByPagination,
} = require('../../../services/channel');

module.exports = async (req, res, next) => {
	const {
		name, limit, page,
		sort, order,
	} = req.query;

	try {
		const result = await getActiveChannelsByPagination(page, {
			name,
			sort,
			limit,
			order,
			projections: CHANNEL_PROJECTIONS.NAME,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
