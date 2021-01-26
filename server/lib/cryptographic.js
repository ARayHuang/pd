const { hmac } = require('ljit-encryption');

/**
 * @param {string} password - The utf-8 string.
 * @param {string} key - The hex string.
 * @returns {string} - The hex string.
 */
function hashPassword(password, key) {
	const hashedPassword = hmac(
		Buffer.from(password),
		Buffer.from(key, 'hex'),
	);

	return hashedPassword.toString('hex');
}

/**
 * @param {string} password - The utf-8 string.
 * @param {string} key - The hex string.
 * @param {string} hash - The hex string.
 * @returns {boolean}
 */
function verifyPassword(password, key, hash) {
	const hashedPassword = hmac(
		Buffer.from(password),
		Buffer.from(key, 'hex'),
	);
	const actualHash = hashedPassword.toString('hex');

	return actualHash === hash;
}

module.exports = {
	hashPassword,
	verifyPassword,
};
