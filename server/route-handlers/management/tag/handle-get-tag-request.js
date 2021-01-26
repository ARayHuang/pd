const {
	TAG_PROJECTIONS,

	getTagWithinStatusAndId,
} = require('../../../services/tag');
const { NotFoundError } = require('ljit-error');
const { TAG_NOT_FOUND } = require('../../../lib/error/code');
const { ENUM_TAG_STATUS } = require('../../../lib/enum');

module.exports = async (req, res, next) => {
	const { tagId } = req.params;
	const allowStatus = [
		ENUM_TAG_STATUS.ACTIVE,
		ENUM_TAG_STATUS.DISABLED,
	];

	try {
		const tag = await getTagWithinStatusAndId(allowStatus, tagId, {
			projections: TAG_PROJECTIONS.MIN,
		});

		if (tag === null) {
			throw new NotFoundError(
				TAG_NOT_FOUND.MESSAGE,
				TAG_NOT_FOUND.CODE,
			);
		}

		res.status(200).json(tag);
	} catch (error) {
		next(error);
	}
};
