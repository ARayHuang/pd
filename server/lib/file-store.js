const AWS = require('aws-sdk');
const config = require('config');
const sharp = require('sharp');
const {
	ENUM_ORDER_FILE_TYPE,
} = require('../lib/enum');
const S3_FILE_CACHE_CONTROL = `max-age=${365 * 24 * 60 * 60}`;

// Disable libvips' cache.
// https://sharp.pixelplumbing.com/api-utility#cache
sharp.cache(false);

/**
 * @param {Object} args
 * 	https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
 * @returns {Promise<ManagedUpload.SendData>}
 */
function upload(args) {
	const s3 = new AWS.S3({
		accessKeyId: config.SERVER.S3.KEY,
		secretAccessKey: config.SERVER.S3.SECRET,
		region: config.SERVER.S3.REGION,
	});

	return s3.upload(args).promise();
}

/**
 * Upload order file binary data to S3.
 * @param {ObjectId|string} id - The order file id.
 * @param {string} type - The order file type.
 * @param {string} extensionName - eg: "jpg"
 * @param {string} mimeType
 * @param {Buffer} buffer
 * @returns {Promise<Array<ManagedUpload.SendData>>}
 */
async function uploadOrderFile({ id, type, extensionName, mimeType, buffer }) {
	try {
		if (type === ENUM_ORDER_FILE_TYPE.VIDEO) {
			return await Promise.all([
				upload({
					Key: `${config.SERVER.S3.FOLDERS.VIDEO}/${id}.${extensionName}`,
					Body: buffer,
					ACL: 'public-read',
					Bucket: config.SERVER.S3.BUCKET,
					ContentType: mimeType,
					CacheControl: S3_FILE_CACHE_CONTROL,
				}),
			]);
		}

		if (type === ENUM_ORDER_FILE_TYPE.IMAGE) {
			const image = sharp(buffer).rotate();

			switch (extensionName) {
				case 'jpg':
					image.jpeg({ quality: 86, progressive: true });
					break;
				case 'png':
					image.png({ quality: 86, progressive: true });
					break;
				default:
					throw new Error(`not implemented extension name .${extensionName}`);
			}

			const fullImage = await image.resize({
				width: 1920,
				height: 1920,
				fit: sharp.fit.inside,
			}).toBuffer();
			const thumbnailImage = await image.resize({
				width: 800,
				height: 800,
				fit: sharp.fit.inside,
			}).toBuffer();

			return await Promise.all([
				upload({
					Key: `${config.SERVER.S3.FOLDERS.FULL_IMAGE}/${id}.${extensionName}`,
					Body: fullImage,
					ACL: 'public-read',
					Bucket: config.SERVER.S3.BUCKET,
					ContentType: mimeType,
					CacheControl: S3_FILE_CACHE_CONTROL,
				}),
				upload({
					Key: `${config.SERVER.S3.FOLDERS.THUMBNAIL_IMAGE}/${id}.${extensionName}`,
					Body: thumbnailImage,
					ACL: 'public-read',
					Bucket: config.SERVER.S3.BUCKET,
					ContentType: mimeType,
					CacheControl: S3_FILE_CACHE_CONTROL,
				}),
			]);
		}

		throw new Error(`not implemented ${type} type`);
	} catch (error) {
		throw error;
	}
}

/**
 * Delete order file binary data on S3.
 * @param {ObjectId|string} id - The order file id.
 * @param {string} type - The order file type.
 * @param {string} extensionName - eg: "jpg"
 * @returns {Promise<S3.DeleteObjectsOutput>}
 */
async function deleteOrderFile({ id, type, extensionName }) {
	try {
		const s3 = new AWS.S3({
			accessKeyId: config.SERVER.S3.KEY,
			secretAccessKey: config.SERVER.S3.SECRET,
			region: config.SERVER.S3.REGION,
		});
		const params = {
			Bucket: config.SERVER.S3.BUCKET,
			Delete: {
				Objects: [],
			},
		};

		switch (type) {
			case ENUM_ORDER_FILE_TYPE.VIDEO:
				params.Delete.Objects = [
					{ Key: `${config.SERVER.S3.FOLDERS.VIDEO}/${id}.${extensionName}` },
				];
				break;
			case ENUM_ORDER_FILE_TYPE.IMAGE:
				params.Delete.Objects = [
					{ Key: `${config.SERVER.S3.FOLDERS.FULL_IMAGE}/${id}.${extensionName}` },
					{ Key: `${config.SERVER.S3.FOLDERS.THUMBNAIL_IMAGE}/${id}.${extensionName}` },
				];
				break;
			default:
				throw new Error(`not implemented ${type} type`);
		}

		return await s3.deleteObjects(params).promise();
	} catch (error) {
		throw error;
	}
}

module.exports = {
	uploadOrderFile,
	deleteOrderFile,
};
