module.exports = (req, res) => {
	res.status(201).json(res.locals.user);
};
