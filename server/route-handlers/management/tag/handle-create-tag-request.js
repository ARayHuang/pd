const { pick } = require('lodash');
const {
	TAG_PROJECTIONS,

	createTag,
	getActiveTags,
} = require('../../../services/tag');
const { ConflictError } = require('ljit-error');
const { TAG_DUPLICATED } = require('../../../lib/error/code');
const {
	publisher: { publishUpdatedTags },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const {
		backgroundColor, fontColor, status,
		name,
	} = req.body;

	try {
		const tag = await createTag({
			backgroundColor,
			fontColor,
			status,
			name,
		});
		const result = pick(tag.toJSON(), [
			'id',
			'name',
			'status',
			'backgroundColor',
			'fontColor',
		]);

		res.status(201).json(result);

		const tags = await getActiveTags({ projections: TAG_PROJECTIONS.MIN });

		publishUpdatedTags(tags);
	} catch (error) {
		if (error.code === 11000) {
			return next(new ConflictError(
				TAG_DUPLICATED.MESSAGE,
				TAG_DUPLICATED.CODE,
			));
		}

		next(error);
	}
};
