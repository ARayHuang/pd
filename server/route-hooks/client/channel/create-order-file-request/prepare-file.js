const config = require('config');
const multer = require('multer');
const { RequestValidationError } = require('ljit-error');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const {
	ORDER_INVALID_REQUEST,
} = require('../../../../lib/error/code');
const multerMiddleware = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: config.SERVER.FILE_SIZE_LIMIT },
}).single('file');

module.exports = (req, res, next) => {
	multerMiddleware(req, res, error => {
		if (error) {
			return next(new RequestValidationError(ORDER_INVALID_REQUEST.CODE, refactorErrors([error])));
		}

		next();
	});
};
