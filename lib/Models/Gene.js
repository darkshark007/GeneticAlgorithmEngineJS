const { seed } = require('./random.js')

class Gene {
	constructor() {
		this.data = {};
	}

	init() { throw 'Not Implemented'; }
	mutate() { throw 'Not Implemented'; }
	clone() {
		let cloned = this();
		cloned.data = JSON.parse(JSON.stringify(this.data));
		return cloned;
	}
}

module.exports = {
	Gene,	
};