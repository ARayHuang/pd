function getSkipByPageAndLimit(page, limit) {
	return limit * (page - 1);
}

module.exports = {
	getSkipByPageAndLimit,
};
