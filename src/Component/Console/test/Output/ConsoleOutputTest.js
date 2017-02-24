const expect = require('chai').expect;

const ConsoleOutput = Jymfony.Component.Console.Output.ConsoleOutput;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

describe('[Console] ConsoleOutput', function () {
    it('constructor', () => {
        let output = new ConsoleOutput(OutputInterface.VERBOSITY_QUIET, true);
        expect(output.verbosity).to.be.equal(OutputInterface.VERBOSITY_QUIET);
        expect(output.formatter).to.be.equal(output.errorOutput.formatter);
    });
});
