const InvitationModel = require('../models/invitation');

async function drop() {
	try {
		await InvitationModel.getInstance().collection.drop();
	} catch (error) {
		if (error.codeName === 'NamespaceNotFound') {
			return;
		}

		throw error;
	}
}

async function deleteMany() {
	try {
		await InvitationModel.getInstance().collection.deleteMany();
	} catch (error) {
		throw error;
	}
}

function syncIndexes() {
	return InvitationModel.getInstance().syncIndexes();
}

module.exports = {
	drop,
	deleteMany,
	syncIndexes,
};
