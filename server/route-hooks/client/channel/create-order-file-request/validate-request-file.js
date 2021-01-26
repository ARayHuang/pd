const { RequestValidationError } = require('ljit-error');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const {
	validator,
} = require('../../../../lib/validations');
const { ORDER_INVALID_REQUEST } = require('../../../../lib/error/code');
const checkFile = validator.compile({
	file: {
		type: 'object',
		props: {
			originalname: {
				type: 'string',
				empty: false,
				trim: true,
			},
			mimetype: {
				type: 'string',
				pattern: /^(image\/(jpeg|png)$|video\/)/,
			},
			buffer: {
				type: 'class',
				instanceOf: Buffer,
			},
		},
	},
});

/**
 * @param {{file: {fieldname: string, originalname: string, mimetype: string, size: number, buffer: Buffer}}} req
 * @param {Object} res
 * @param {function} next
 * @returns {undefined}
 */
module.exports = (req, res, next) => {
	const validationResult = checkFile(req);

	if (validationResult === true) {
		switch (req.file.mimetype) {
			case 'image/jpeg':
				req.file.originalname = req.file.originalname.replace(/\.jpeg$/i, '.jpg');

				if (!/\.jpg$/i.test(req.file.originalname)) {
					req.file.originalname = `${req.file.originalname}.jpg`;
				}

				break;
			case 'image/png':
				if (!/\.png$/i.test(req.file.originalname)) {
					req.file.originalname = `${req.file.originalname}.png`;
				}

				break;
			default:
				break;
		}

		return next();
	}

	const error = new RequestValidationError(
		ORDER_INVALID_REQUEST.CODE,
		refactorErrors(validationResult),
	);

	next(error);
};
