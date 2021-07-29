const repl = require('repl');
const { PerformanceObserver, performance } = require('perf_hooks');

const { KnapsackGenerator } = require('./Scenarios/KnapsackScenario.js');
const { Engine } = require('./Models/Engine.js');

let r = repl.start('> ');

r.context.KnapsackGenerator = KnapsackGenerator;

let gen = KnapsackGenerator({});
r.context.gen = gen;

let scen = gen({});
r.context.scen = scen;

let engine = new Engine(gen);
r.context.engine = engine;
engine.setSeed('Fish!');
engine.run();