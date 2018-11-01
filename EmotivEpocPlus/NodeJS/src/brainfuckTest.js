const BrainFuck = require("../libs/brainfuck");

const EPOC = new BrainFuck();

EPOC.Connect();

// DATA Stream
EPOC.on('Stream', (data) =>{
    // console.log(`command: ${ data.command } | eyeAction: ${ data.eyeAction } | upperFaceAction: ${ data.upperFaceAction } | lowerFaceAction: ${ data.lowerFaceAction } `)
})

// INITIALIZE
EPOC.on('Ready', () => {
    EPOC.startTraining('neutral');
});



