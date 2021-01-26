module.exports = (req, res, next) => {
	res.locals.log = {
		operator: res.locals.invitation.inviter,
		orderId: res.locals.invitation.order,
		associateUser: req.user._id,
	};

	next();
};
