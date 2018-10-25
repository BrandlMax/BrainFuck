const BrainFuck = require("../libs/brainfuck");

const EPOC = new BrainFuck();

EPOC.Connect();

EPOC.on('Ready', () => {
    EPOC.Subscribe();
});

