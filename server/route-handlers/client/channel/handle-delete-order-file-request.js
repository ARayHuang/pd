const {
	deleteOrderFileById,
} = require('../../../services/order-file');
const { NotFoundError } = require('ljit-error');
const { ORDER_FILE_NOT_FOUND } = require('../../../lib/error/code');
const { getExtensionNameByFilename } = require('../../../lib/common');
const { deleteOrderFile } = require('../../../lib/file-store');

module.exports = async (req, res, next) => {
	const { fileId } = req.params;
	const { orderFile } = res.locals;

	try {
		const result = await deleteOrderFileById(fileId);

		if (result.deletedCount === 0) {
			throw new NotFoundError(
				ORDER_FILE_NOT_FOUND.MESSAGE,
				ORDER_FILE_NOT_FOUND.CODE,
			);
		}

		await deleteOrderFile({
			id: orderFile.id,
			type: orderFile.type,
			extensionName: getExtensionNameByFilename(orderFile.filename),
		});

		res.status(204).end();
	} catch (error) {
		next(error);
	}
};
