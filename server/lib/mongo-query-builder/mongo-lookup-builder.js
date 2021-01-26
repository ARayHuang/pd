class mongoLookupBuilder {
	constructor() {
		this.lookupClause = [];
	}

	/**
	 * https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
	 * @param {{
	 * 		from: string,
	 * 		as: string,
	 * 		localField: (string|null),
	 * 		foreignField: (string|null),
	 * 		let: Object,
	 * 		pipeline: (Array<Object>|null)
	 * 	}} args
	 * @returns {mongoLookupBuilder}
	 */
	setLookup(args) {
		this.lookupClause.push({ $lookup: args });
		return this;
	}

	setUnwind(filePath, { preserveNullAndEmptyArrays } = { preserveNullAndEmptyArrays: false }) {
		this.lookupClause.push(
			{
				$unwind: {
					path: '$' + filePath,
					preserveNullAndEmptyArrays,
				},
			});

		return this;
	}

	build() {
		return this.lookupClause;
	}
}

module.exports = mongoLookupBuilder;
