const {
	TAG_PROJECTIONS,

	updateTagById,
	getActiveTags,
} = require('../../../services/tag');
const { NotFoundError } = require('ljit-error');
const { TAG_NOT_FOUND } = require('../../../lib/error/code');
const {
	publisher: { publishUpdatedTags },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { tagId } = req.params;
	const { status } = req.body;

	try {
		const result = await updateTagById(tagId, {
			status,
		}, {
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
