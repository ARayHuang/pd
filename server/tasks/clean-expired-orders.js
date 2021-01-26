const OrderModel = require('../models/order');
const OrderCommentModel = require('../models/order-comment');
const OrderFileModel = require('../models/order-file');
const OrderOperationRecordModel = require('../models/order-operation-record');
const InvitationModel = require('../models/invitation');
const LogModel = require('../models/log');
const { deleteOrderFile } = require('../lib/file-store');
const { getExtensionNameByFilename } = require('../lib/common');
const EXPIRED_TIME_DURATION_IN_DAYS = 60;

/**
 * Delete orders `createdAt` of that is less and equal than EXPIRED_TIME_DURATION_IN_DAYS.
 * @returns {Promise<Array<string>>} - Deleted order ids.
 */
module.exports = () => {
	const expiredBefore = new Date();
	const deletedOrderIds = [];

	expiredBefore.setDate(expiredBefore.getDate() - EXPIRED_TIME_DURATION_IN_DAYS);
	return OrderModel.getInstance()
		.where({
			createdAt: { $lte: expiredBefore },
		})
		.cursor()
		.eachAsync(async order => {
			try {
				deletedOrderIds.push(order.id);

				await OrderCommentModel.deleteMany({ orderId: order._id }).exec();
				await OrderFileModel.getInstance()
					.where({ orderId: order._id })
					.cursor()
					.eachAsync(orderFile => {
						const deleteFileArguments = {
							id: orderFile.id,
							type: orderFile.type,
							extensionName: getExtensionNameByFilename(orderFile.filename),
						};

						return deleteOrderFile(deleteFileArguments).then(() => orderFile.delete());
					});
				await OrderOperationRecordModel.deleteMany({ orderId: order._id }).exec();
				await LogModel.deleteMany({ orderId: order._id }).exec();
				await InvitationModel.deleteMany({ order: order._id }).exec();
				await order.delete();
			} catch (error) {
				throw error;
			}
		})
		.then(() => {
			return deletedOrderIds;
		});
};
