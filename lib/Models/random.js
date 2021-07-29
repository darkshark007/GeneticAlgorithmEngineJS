/* An interface for a controlled, global singleton PRNG */

var seedrandom = require('seedrandom');

let _rng = null;
let _seed = null;

let seed = {
	'Fish': 5,
}

seed.seed = function seed() {
	return `${_seed}`;
}

seed.setRandomSeed = function setRandomSeed() {
	seed.setSeed(`${Math.random()}`);
}

seed.setSeed = function setSeed(newSeed) {
	_seed = newSeed;
	_rng = seedrandom(_seed);
}

seed.reset = function reset() {
	seed.setSeed(_seed);
}

seed.next = function next() {
	return _rng();
}

seed.setRandomSeed();

module.exports = {
	'seed': seed,
};
