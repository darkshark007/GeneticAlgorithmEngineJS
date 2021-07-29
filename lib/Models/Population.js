const { seed } = require('./random.js')

class Population {
	constructor(individuals) {
		this.individuals = individuals || [];
	}

	_copyPopulation() {
		return new Population(this.individuals.map((i) => i.clone()));
	}

	// Population Management Functions
	add(individual) { 
		let clonePop = this._copyPopulation();
		clonePop.individuals.push(individual);
		return clonePop
	}
	appendAll(pop) { 
		let clonePop = this._copyPopulation();
		let cloneIncoming = pop._copyPopulation();
		clonePop.individuals = [
			...clonePop.individuals,
			...cloneIncoming.individuals,
		]
		return clonePop;
	}
	removeAll(pop) { throw 'Not Implemented Yet'; }
	removeDuplicates() { 
		let signatureMap = {};
		this.individuals.forEach((i) => signatureMap[i.geneSignature()] = i);
		let subPop = Object.keys(signatureMap).map((k) => signatureMap[k].clone());
		return new Population(subPop);
	}
	sortByEvaluation() {
		let clonePop = this._copyPopulation();
		clonePop.individuals.sort((a, b) => b.evaluate() - a.evaluate());
		return clonePop;
	};
	getTop(n) {
		let subPop = this.individuals.slice(0,n);
		return new Population(subPop);
	}
	getBottom(n) { throw 'Not Implemented Yet'; }
	randomlySelect(n) { 
		let subPop = [];
		let remainingPop = [...this.individuals];
		for (let i = 0; i < n && remainingPop.length > 0; i++) {
			let nextInd = remainingPop.splice(Math.floor(seed.next()*remainingPop.length),1)[0];
			subPop.push(nextInd.clone());
		}
		return new Population(subPop);
	}
}

module.exports = {
	Population,	
};