const {
	TAG_PROJECTIONS,

	getTagsWithinStatus,
} = require('../../../services/tag');

module.exports = async (req, res, next) => {
	const { name, sort, order } = req.query;
	const { status } = res.locals;

	try {
		const result = await getTagsWithinStatus(status, {
			name,
		}, {
			sort,
			order,
			projections: TAG_PROJECTIONS.MIN,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
