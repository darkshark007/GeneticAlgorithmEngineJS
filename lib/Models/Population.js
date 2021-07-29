const { seed } = require('./random.js')

class Population {
	constructor(individuals) {
		this._individuals = individuals ? [...individuals] : [];
		this._cloned = false;
	}

	get individuals() {
		if (!this._cloned) {
			this._individuals = this._individuals.map((i) => i.clone());
			this._cloned = true;
		}
		return this._individuals;
	}

	_copyPopulation() {
		return new Population(this._individuals);
	}

	// Population Management Functions
	add(individual) { 
		let clonePop = this._copyPopulation();
		clonePop._individuals.push(individual);
		return clonePop
	}
	appendAll(pop) { 
		return new Population([
			...this._individuals,
			...pop._individuals,
		]);
	}
	removeAll(pop) { throw 'Not Implemented Yet'; }
	removeDuplicates() { 
		let signatureMap = {};
		this._individuals.forEach((i) => signatureMap[i.geneSignature()] = i);
		let subPop = Object.keys(signatureMap).map((k) => signatureMap[k]);
		return new Population(subPop);
	}
	sortByEvaluation() {
		let clonePop = this._copyPopulation();
		clonePop._individuals.sort((a, b) => b.evaluate() - a.evaluate());
		return clonePop;
	};
	getTop(n) {
		return new Population(this._individuals.slice(0,n));
	}
	getBottom(n) { throw 'Not Implemented Yet'; }
	randomlySelect(n) { 
		let subPop = [];
		let remainingPop = [...this._individuals];
		for (let i = 0; i < n && remainingPop.length > 0; i++) {
			let nextInd = remainingPop.splice(Math.floor(seed.next()*remainingPop.length),1)[0];
			subPop.push(nextInd);
		}
		return new Population(subPop);
	}
}

module.exports = {
	Population,	
};