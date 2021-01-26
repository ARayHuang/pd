const { ENUM_LOG_TYPE } = require('../../../../lib/enum');

module.exports = (req, res, next) => {
	res.locals.log = {
		operator: req.user._id,
		orderId: req.params.orderId,
		type: ENUM_LOG_TYPE.UPDATED_ORDER_DESCRIPTION,
		details: req.body,
	};

	next();
};
