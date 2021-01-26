const { ObjectId } = require('mongoose').Types;
const {
	publisher: { publishCreatedOrderFile },
} = require('../../../lib/socket');
const {
	ENUM_ORDER_FILE_TYPE,
} = require('../../../lib/enum');
const { getExtensionNameByFilename } = require('../../../lib/common');
const {
	createOrderFile,
} = require('../../../services/order-file');
const {
	uploadOrderFile,
} = require('../../../lib/file-store');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;

	try {
		const orderFileId = new ObjectId();
		const orderFileType = /^image\//.test(req.file.mimetype) ?
			ENUM_ORDER_FILE_TYPE.IMAGE :
			ENUM_ORDER_FILE_TYPE.VIDEO;
		const extensionName = getExtensionNameByFilename(req.file.originalname);

		await uploadOrderFile({
			id: orderFileId,
			type: orderFileType,
			extensionName,
			mimeType: req.file.mimetype,
			buffer: req.file.buffer,
		});

		const orderFile = await createOrderFile({
			id: orderFileId,
			orderId,
			userId: req.user._id,
			type: orderFileType,
			filename: req.file.originalname,
		});

		res.status(201).json(orderFile);

		publishCreatedOrderFile({
			...orderFile.toJSON(),
			orderId,
		});

		res.locals.operationRecord = { orderId: orderId };

		next();
	} catch (error) {
		return next(error);
	}
};
