const { seed } = require('./random.js')

class Controller {
	constructor(engine) {
		this._engine = engine;
	}

	get currentPopulation() {
		return this._engine.currentPopulation._copyPopulation();
	}
	get newPopulation() {
		return this._engine.newPopulation._copyPopulation();
	}
	get iteration() {
		return this._engine.iteration;
	}

	// Population Management Functions
	addIndividualToPopulation(ind) { 
		this._engine.newPopulation = this._engine.newPopulation.add(ind);
	}
	addToPopulation(pop) {
		this._engine.newPopulation = this._engine.newPopulation.appendAll(pop);
	}
	removeFromPopulation(pop) { throw 'Not Implemented Yet'; }
	removeDuplicates() { 
		this._engine.newPopulation = this._engine.newPopulation.removeDuplicates();
	}
	setPopulation(pop) { throw 'Not Implemented Yet'; }
}

module.exports = {
	Controller,	
};