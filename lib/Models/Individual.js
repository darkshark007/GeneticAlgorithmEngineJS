const { seed } = require('./random.js')

class Individual {
	constructor() {
		this.genes = {};
	}

	init() { throw 'Not Implemented'; }
	evaluate() { throw 'Not Implemented'; }
	cross(individual) { throw 'Not Implemented'; }
	mutate() { throw 'Not Implemented'; }
	clone() {
		let cloned = new this.constructor();
		cloned.data = JSON.parse(JSON.stringify(this.data));
		cloned.genes = JSON.parse(JSON.stringify(this.genes));
		return cloned;
	}
	geneSignature() { throw 'Not Implemented'; }
}

module.exports = {
	Individual,	
};