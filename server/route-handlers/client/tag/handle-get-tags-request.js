const {
	TAG_PROJECTIONS,

	getActiveTags,
} = require('../../../services/tag');

module.exports = async (req, res, next) => {
	try {
		const result = await getActiveTags({
			projections: TAG_PROJECTIONS.NAME_AND_COLOR,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
