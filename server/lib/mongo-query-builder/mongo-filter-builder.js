class mongoFilterBuilder {
	constructor() {
		this.filterClause = {};
	}

	setIn(key, value) {
		const operator = '$in';

		this.setFilterClause(operator, key, value);

		return this;
	}

	setEqual(key, value) {
		const operator = '$eq';

		this.setFilterClause(operator, key, value);

		return this;
	}

	setRegex(key, value) {
		const operator = '$regex';

		this.setFilterClause(operator, key, value);

		return this;
	}

	setGte(key, value) {
		const operator = '$gte';

		this.setFilterClause(operator, key, value);

		return this;
	}

	setLte(key, value) {
		const operator = '$lte';

		this.setFilterClause(operator, key, value);

		return this;
	}

	setFilterClause(operator, key, value) {
		if (value === undefined || value === null) {
			return;
		}

		if (this.filterClause[key] === undefined) {
			this.filterClause[key] = {};
		}

		this.filterClause[key][operator] = value;
	}

	build() {
		return this.filterClause;
	}
}

module.exports = mongoFilterBuilder;
