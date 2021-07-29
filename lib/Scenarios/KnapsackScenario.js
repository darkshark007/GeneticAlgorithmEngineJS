const { seed } = require('../Models/random.js')

const { Scenario } = require('../Models/Scenario.js');
const { Individual } = require('../Models/Individual.js');

function KnapsackGenerator({maxKnapsackWeight=100, numItems=100, minItemWeight=1, maxItemWeight=10, minItemValue=1, maxItemValue=50}) {
	return (controller) => new KnapsackScenario({controller, maxKnapsackWeight, numItems, minItemWeight, maxItemWeight, minItemValue, maxItemValue})
}

class KnapsackScenario extends Scenario {
	constructor({controller, maxKnapsackWeight, numItems, minItemWeight, maxItemWeight, minItemValue, maxItemValue}) {
		super(controller);

		this.maxKnapsackWeight = maxKnapsackWeight;
		this.numItems = numItems;
		this.minItemWeight = minItemWeight;
		this.maxItemWeight = maxItemWeight;
		this.minItemValue = minItemValue;
		this.maxItemValue = maxItemValue;

		this.possibleItems = [];

		// Randomly generate items
		let weightRange = this.maxItemWeight - this.minItemWeight;
		let valueRange = this.maxItemValue - this.minItemValue;
		for (let idx = 0; idx < this.numItems; idx++) {
			let randWeight = Math.floor((seed.next()*weightRange)+this.minItemWeight);
			let randValue = Math.floor((seed.next()*valueRange)+this.minItemValue);
			let nextItem = KnapsackItem(randWeight, randValue);
			this.possibleItems.push(nextItem);
		}
	}

	// Lifecycle Hooks
	runInitialization()  { 
		// Randomly generate items
		for (let idx = 0; idx < 200; idx++) {
			let newIndividual = new KnapsackIndividual(this);
			newIndividual.init();
			this.controller.addIndividualToPopulation(newIndividual);
		}
	}

	shouldIterate()  { 
		if (this.controller.iteration > 50) return false;
		return true;
	}
	willPerformIteration()  { }
	runIteration()  {

		// Pass on the top
		this.controller.addToPopulation(this.controller.currentPopulation.sortByEvaluation().getTop(25));

		// Cross the top against itself
		let topPop = this.controller.currentPopulation.sortByEvaluation().getTop(25);
		for (let iCrossTop = 0; iCrossTop < 100; iCrossTop++) {
			let ind1 = topPop.randomlySelect(1).individuals[0];
			let ind2 = topPop.randomlySelect(1).individuals[0];
			let newInd = ind1.cross(ind2);
			this.controller.addIndividualToPopulation(newInd);
		}

		let maxPop = this.controller.currentPopulation.sortByEvaluation().getTop(5).individuals;
		for (let iMaxTop1 = 0; iMaxTop1 < maxPop.length; iMaxTop1++) {
			for (let iMaxTop2 = 0; iMaxTop2 < maxPop.length; iMaxTop2++) {
				let ind1 = maxPop[iMaxTop1];
				let ind2 = maxPop[iMaxTop2];
				let newInd = ind1.cross(ind2);
				this.controller.addIndividualToPopulation(newInd);
			}
		}


		// Cross the top against the general population
		for (let iCrossAll = 0; iCrossAll < 50; iCrossAll++) {
			let ind1 = topPop.randomlySelect(1).individuals[0];
			let ind2 = this.controller.currentPopulation.randomlySelect(1).individuals[0];
			let newInd = ind1.cross(ind2);
			this.controller.addIndividualToPopulation(newInd);
		}

		// Add some new Individuals
		for (let iNew = 0; iNew < 50; iNew++) {
			let newIndividual = new KnapsackIndividual(this);
			newIndividual.init();
			this.controller.addIndividualToPopulation(newIndividual);
		}

		// Remove Individuals with identical genes
		this.controller.removeDuplicates();
	}
	didPerformIteration()  { }

	runCompletion()  { }	
}

let _itemId = 0;
function KnapsackItem(weight, value) {
	let id = _itemId++;
	return { weight, value, id };
}

class KnapsackIndividual extends Individual {
	constructor(scenario) {
		super();
		this.scenario = scenario;
		// Genes?
		this.data = {
			'knapsack': [],
			'weight': 0,
			'value': 0,
		};
	}
	
	init() {
		let weight = 0;
		let value = 0;
		let itemsRemaining = [...this.scenario.possibleItems];
		while (itemsRemaining.length > 0) {
			let nextItem = itemsRemaining.splice(Math.floor(seed.next()*itemsRemaining.length),1)[0];
			if ((weight+nextItem.weight) > this.scenario.maxKnapsackWeight) break;
			this.data.knapsack.push(nextItem);
			weight += nextItem.weight;
			value += nextItem.value;
		}
		this.data.weight = weight;
		this.data.value = value;
	}

	get weight() { return this.data.weight }
	get value() { return this.data.value; }
	evaluate() { return this.value; }
	cross(individual) {
		let newInd = new this.constructor(this.scenario);

		let weight = 0;
		let value = 0;
		let itemMap = {};
		[...this.data.knapsack, ...individual.data.knapsack].forEach((i) => itemMap[i.id] = i);
		let itemsRemaining = Object.keys(itemMap).map((k) => itemMap[k]);
		while (itemsRemaining.length > 0) {
			let nextItem = itemsRemaining.splice(Math.floor(seed.next()*itemsRemaining.length),1)[0];
			if ((weight+nextItem.weight) > this.scenario.maxKnapsackWeight) break;
			newInd.data.knapsack.push(nextItem);
			weight += nextItem.weight;
			value += nextItem.value;
		}
		newInd.data.weight = weight;
		newInd.data.value = value;
		return newInd;
	}
	mutate() { throw 'Not Implemented'; }
	clone() {
		let cl = super.clone();
		cl.scenario = this.scenario;
		return cl;
	}
	geneSignature() { 
		if (!this.signature) {
			let itemMap = {};
			[...this.data.knapsack].forEach((i) => itemMap[i.id] = i);
			this.signature = Object.keys(itemMap).sort().join(",");
		}
		return this.signature;
	}

}

module.exports = {
	KnapsackGenerator,
	KnapsackScenario,
	KnapsackItem,
	KnapsackIndividual,
}