const expect = require('chai').expect;

const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const Table = Jymfony.Component.Console.Helper.Table;
const Prophet = Jymfony.Component.Testing.Prophet;

describe('[Console] Table', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         */
        this._prophet = new Prophet();
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('constructor', () => {
        let output = this._prophet.prophesize(OutputInterface);

        let table = new Table(output);
    });
});
