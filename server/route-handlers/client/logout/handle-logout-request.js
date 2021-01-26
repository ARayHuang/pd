module.exports = (req, res) => {
	req.logout();
	res.status(201).end();
};
