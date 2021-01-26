/**
 * Get original extension filename in lower case.
 * @param {string} filename
 * @returns {string}
 * 	"file.jpg" -> "jpg"
 * 	"file.new.jpg" -> "jpg"
 * 	"jpg" -> "jpg"
 * 	".jpg" -> "jpg"
 * 	"jpg." -> ""
 * 	"" -> ""
 */
function getExtensionNameByFilename(filename) {
	const result = filename.match(/([^.]+)$/);

	if (result) {
		return result[1].toLowerCase();
	}

	return '';
}

module.exports = {
	getExtensionNameByFilename,
};
