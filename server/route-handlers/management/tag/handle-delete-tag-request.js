const { NotFoundError } = require('ljit-error');
const { TAG_NOT_FOUND } = require('../../../lib/error/code');
const {
	TAG_PROJECTIONS,

	deleteTagById,
	getActiveTags,
} = require('../../../services/tag');
const {
	publisher: { publishUpdatedTags },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { tagId } = req.params;

	try {
		const result = await deleteTagById(tagId, {
			projections: TAG_PROJECTIONS.ID,
		});

		if (result === null) {
			throw new NotFoundError(
				TAG_NOT_FOUND.MESSAGE,
				TAG_NOT_FOUND.CODE,
			);
		}

		res.status(204).end();

		const tags = await getActiveTags({ projections: TAG_PROJECTIONS.MIN });

		publishUpdatedTags(tags);
	} catch (error) {
		next(error);
	}
};
