const expect = require('chai').expect;
const stream = require('stream');

const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const StreamOutput = Jymfony.Component.Console.Output.StreamOutput;
const Table = Jymfony.Component.Console.Helper.Table;
const TableCell = Jymfony.Component.Console.Helper.TableCell;
const Prophet = Jymfony.Component.Testing.Prophet;

describe('[Console] Table', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         */
        this._prophet = new Prophet();
        this._stream = new stream.PassThrough();

        this._getOutputStream = (decorated = false) => {
            return new StreamOutput(this._stream, StreamOutput.VERBOSITY_NORMAL, decorated);
        };
        this._getOutputContent = () => {
            return this._stream.read();
        }
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('constructor', () => {
        let output = this._prophet.prophesize(OutputInterface);

        new Table(output.reveal());
    });

    it('should render table cell with int value', () => {
        let output = this._getOutputStream();
        let table = new Table(output);
        table.setRows([[new TableCell(12345)]]);
        table.render();

        let expected = ```
    +-------+
    | 12345 |
    +-------+
```;

        expect(this._getOutputContent(output)).to.be.equal(expected);
    });
});
