const { seed } = require('./random.js')

const { Controller } = require('./Controller.js');
const { Population } = require('./Population.js');

class Engine {
    constructor(generator) {
        this.scenarioGenerator = generator;
        this.scenario = null;
        this.controller = new Controller(this);
        this.populationsByIteration = {};
        this.currentPopulation = null;;
        this.newPopulation = null;
        this.iteration = 0;
    }

    setSeed(newSeed) {
    	seed.setSeed(newSeed);
    }

    run() {
        // Init
        seed.reset();
        this.populationsByIteration = {};
        this.newPopulation = new Population();
        this.currentPopulation = new Population();
        this.iteration = 0;
        let scenario = this.scenarioGenerator(this.controller);
        this.scenario = scenario;
        console.log("Initializing...");
        if (scenario.runInitialization !== null) {
        	scenario.runInitialization();
        }
        console.log("Finished Initialization");
        this.rollIteration();

        // Loop
        while (scenario.shouldIterate()) {
        	let iterationLog = `Processed Iteration #${this.iteration}\n`;
			if (scenario.willPerformIteration) scenario.willPerformIteration();
			if (scenario.runIteration) scenario.runIteration();
			iterationLog += `  Current Population Size: ${this.currentPopulation._individuals.length}\n  New Population Size: ${this.newPopulation._individuals.length}\n`;
			this.rollIteration();
			if (scenario.didPerformIteration) scenario.didPerformIteration();
			iterationLog += `  Top individuals:\n`;
			let top5 = this.currentPopulation.getTop(5);
			for (let topIdx = 0; topIdx < top5._individuals.length; topIdx++) {
				let topInd = top5._individuals[topIdx];
				iterationLog += `    [${topIdx+1}] ${topInd}\n`;
			}
			console.log(iterationLog);
        }

        // Clean up
        if (scenario.runCompletion) scenario.runCompletion();
        this.rollIteration();
        console.log("Run completed!");
    }

	rollIteration() {
		this.populationsByIteration[this.iteration] = this.newPopulation;
		this.iteration++;

		this.currentPopulation = this.newPopulation;
		this.newPopulation = new Population();
	}

    // get currentPopulation() {
    //     return this._engine.currentPopulation;
    // }
    // get newPopulation() {
    //     return this._engine.newPopulation;
    // }
    // get iteration() {
    //     return this._engine.iteration;
    // }

    // // Population Management Functions
    // addToPopulation(pop) { throw 'Not Implemented Yet'; }
    // removeFromPopulation(pop) { throw 'Not Implemented Yet'; }
    // setPopulation(pop) { throw 'Not Implemented Yet'; }
}

module.exports = {
    Engine,    
};