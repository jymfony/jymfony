const expect = require('chai').expect;
const stream = require('stream');
const os = require('os');

const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const StreamOutput = Jymfony.Component.Console.Output.StreamOutput;
const Table = Jymfony.Component.Console.Helper.Table;
const TableCell = Jymfony.Component.Console.Helper.TableCell;
const TableSeparator = Jymfony.Component.Console.Helper.TableSeparator;
const TableStyle = Jymfony.Component.Console.Helper.TableStyle;
const Prophet = Jymfony.Component.Testing.Prophet;

describe('[Console] Table', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         */
        this._prophet = new Prophet();
        this._stream = new stream.PassThrough();
        this._readOutput = '';

        this._getOutputStream = (decorated = false) => {
            this._output = new StreamOutput(this._stream, StreamOutput.VERBOSITY_NORMAL, decorated);
            this._output.deferUncork = false;

            return this._output;
        };
        this._getOutputContent = () => {
            /** @type {Buffer} */
            const read = this._stream.read();
            if (null !== read) {
                this._readOutput += read.toString();
            }

            return this._readOutput.replace(new RegExp(os.EOL, 'g'), '\n');
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

        const outputContent = this._getOutputContent(output);

        let expected =
`+-------+
| 12345 |
+-------+
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should render table cell with float value', () => {
        let output = this._getOutputStream();
        let table = new Table(output);
        table.setRows([[new TableCell(12345.01)]]);
        table.render();

        const outputContent = this._getOutputContent(output);

        let expected =
`+----------+
| 12345.01 |
+----------+
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should render table with specific style', () => {
        let output = this._getOutputStream();

        let style = new TableStyle();
        style
            .setHorizontalBorderChar('.')
            .setVerticalBorderChar('.')
            .setCrossingChar('.')
        ;

        let table = new Table(output);
        Table.setStyleDefinition('dotfull', style);
        table
            .setHeaders(['Foo'])
            .setRows([['Bar']])
        ;
        table.style = 'dotfull';
        table.render();

        const outputContent = this._getOutputContent(output);

        let expected =
`.......
. Foo .
.......
. Bar .
.......
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should render row separators', () => {
        let output = this._getOutputStream();

        let table = new Table(output);
        table
            .setHeaders(['Foo'])
            .setRows([
                ['Bar1'],
                new TableSeparator(),
                ['Bar2'],
                new TableSeparator(),
                ['Bar3'],
            ])
        ;
        table.render();

        const outputContent = this._getOutputContent(output);

        let expected =
`+------+
| Foo  |
+------+
| Bar1 |
+------+
| Bar2 |
+------+
| Bar3 |
+------+
`;

        expect(outputContent).to.be.equal(expected);
        expect(table).to.be.equal(table.addRow(new TableSeparator()));
    });

    it('should render multi calls', () => {
        let output = this._getOutputStream();

        let table = new Table(output);
        table.setRows([
            [new TableCell('foo', {colspan: 2})],
        ]);
        table.render();
        table.render();
        table.render();

        const outputContent = this._getOutputContent(output);

        let expected =
`+----+---+
| foo    |
+----+---+
+----+---+
| foo    |
+----+---+
+----+---+
| foo    |
+----+---+
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should render 4th column with custom style', () => {
        let output = this._getOutputStream();

        let table = new Table(output);
        table
            .setHeaders(['ISBN', 'Title', 'Author', 'Price'])
            .setRows([
                ['99921-58-10-7', 'Divine Comedy', 'Dante Alighieri', '9.95'],
                ['9971-5-0210-0', 'A Tale of Two Cities', 'Charles Dickens', '139.25'],
            ])
        ;

        let style = new TableStyle();
        style.setPadType(__jymfony.str_pad.LEFT);
        table.setColumnStyle(3, style);

        table.render();

        const outputContent = this._getOutputContent(output);

        let expected =
`+---------------+----------------------+-----------------+--------+
| ISBN          | Title                | Author          |  Price |
+---------------+----------------------+-----------------+--------+
| 99921-58-10-7 | Divine Comedy        | Dante Alighieri |   9.95 |
| 9971-5-0210-0 | A Tale of Two Cities | Charles Dickens | 139.25 |
+---------------+----------------------+-----------------+--------+
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should throw when a cell is an array', () => {
        let output = this._getOutputStream();

        let table = new Table(output);
        table
            .setHeaders(['ISBN', 'Title', 'Author', 'Price'])
            .setRows([
                ['99921-58-10-7', [], 'Dante Alighieri', '9.95'],
            ])
        ;

        expect(() => table.render()).to.throw(
            InvalidArgumentException,
            'A cell must be a TableCell or a scalar, object given.'
        );
    });

//    const books = [
//        ['99921-58-10-7', 'Divine Comedy', 'Dante Alighieri'],
//        ['9971-5-0210-0', 'A Tale of Two Cities', 'Charles Dickens'],
//        ['960-425-059-0', 'The Lord of the Rings', 'J. R. R. Tolkien'],
//        ['80-902734-1-6', 'And Then There Were None', 'Agatha Christie'],
//    ];
//
//    const headers = [
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title'],
//        [],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title'],
//        [],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Title', 'Author'],
//        ['ISBN', 'Author'],
//        [
//            [new TableCell('Main title', {colspan: 3})],
//            ['ISBN', 'Title', 'Author'],
//        ],
//        [],
//        [
//            new TableCell('<comment>Long Title</comment>', {colspan: 3}),
//        ],
//        [],
//    ];
//    const style = 'default';
//    const expected =
//`+---------------+--------------------------+------------------+
//| ISBN          | Title                    | Author           |
//+---------------+--------------------------+------------------+
//| 99921-58-10-7 | Divine Comedy            | Dante Alighieri  |
//| 9971-5-0210-0 | A Tale of Two Cities     | Charles Dickens  |
//| 960-425-059-0 | The Lord of the Rings    | J. R. R. Tolkien |
//| 80-902734-1-6 | And Then There Were None | Agatha Christie  |
//+---------------+--------------------------+------------------+
//`;
//
//    it('should render table', () => {
//        let output = this._getOutputStream();
//        let table = new Table(output);
//        table
//            .setHeaders(headers)
//            .setRows(books)
//        ;
//        table.style = style;
//        table.render();
//
//        const outputContent = this._getOutputContent(output);
//
//        expect(outputContent).to.be.equal(expected);
//    });
});
