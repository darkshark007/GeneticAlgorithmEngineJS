const { seed } = require('./random.js')

class Scenario {
	constructor(controller) {
		this.controller = controller;
	};

	// Lifecycle Hooks
	runInitialization()  { throw 'Not Implemented Yet'; }

	shouldIterate()  { throw 'Not Implemented Yet'; }
	willPerformIteration()  { throw 'Not Implemented Yet'; }
	runIteration()  { throw 'Not Implemented Yet'; }
	didPerformIteration()  { throw 'Not Implemented Yet'; }

	runCompletion()  { throw 'Not Implemented Yet'; }
}

module.exports = {
	Scenario,	
};