const expect = require('chai').expect;

const ConsoleOutput = Jymfony.Console.Output.ConsoleOutput;
const OutputInterface = Jymfony.Console.Output.OutputInterface;

describe('ConsoleOutput', function () {
    it('constructor', () => {
        let output = new ConsoleOutput(OutputInterface.VERBOSITY_QUIET, true);
        expect(output.verbosity).to.be.equal(OutputInterface.VERBOSITY_QUIET);
        expect(output.formatter).to.be.equal(output.errorOutput.formatter);
    });
});
