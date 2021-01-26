const { countTagsWithinStatus } = require('../../../../services/tag');
const config = require('config');
const { ForbiddenError } = require('ljit-error');
const { TAG_IS_EXCEEDED } = require('../../../../lib/error/code');
const { ENUM_TAG_STATUS } = require('../../../../lib/enum');

module.exports = async (req, res, next) => {
	try {
		const tagCount = await countTagsWithinStatus([ENUM_TAG_STATUS.ACTIVE, ENUM_TAG_STATUS.DISABLED]);

		if (tagCount >= config.SERVER.TAG.MAX) {
			throw new ForbiddenError(
				TAG_IS_EXCEEDED.MESSAGE,
				TAG_IS_EXCEEDED.CODE,
			);
		}

		next();
	} catch (error) {
		next(error);
	}
};
