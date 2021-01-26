const {
	TAG_PROJECTIONS,

	getActiveTagById,
} = require('../../../../services/tag');
const { NotFoundError } = require('ljit-error');
const { TAG_NOT_FOUND } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { tagId } = req.body;

	try {
		const tag = await getActiveTagById(tagId, {
			projections: TAG_PROJECTIONS.NAME_AND_COLOR,
		});

		if (tag === null) {
			throw new NotFoundError(
				TAG_NOT_FOUND.MESSAGE,
				TAG_NOT_FOUND.CODE,
			);
		}

		res.locals.tags = [tag];

		next();
	} catch (error) {
		next(error);
	}
};
