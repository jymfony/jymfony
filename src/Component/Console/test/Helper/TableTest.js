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
        };
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('constructor', () => {
        const output = this._prophet.prophesize(OutputInterface);

        new Table(output.reveal());
    });

    it('should render table cell with int value', () => {
        const output = this._getOutputStream();
        const table = new Table(output);
        table.setRows([
            [ new TableCell(12345) ],
        ]);
        table.render();

        const outputContent = this._getOutputContent(output);

        const expected =
`+-------+
| 12345 |
+-------+
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should render table cell with float value', () => {
        const output = this._getOutputStream();
        const table = new Table(output);
        table.setRows([ [ new TableCell(12345.01) ] ]);
        table.render();

        const outputContent = this._getOutputContent(output);

        const expected =
`+----------+
| 12345.01 |
+----------+
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should render table with specific style', () => {
        const output = this._getOutputStream();

        const style = new TableStyle();
        style.setHorizontalBorderChars('.');
        style.setVerticalBorderChars('.');
        style.setCrossingChars('.', '.', '.', '.', '.', '.', '.', '.', '.');

        const table = new Table(output);
        Table.setStyleDefinition('dotfull', style);
        table
            .setHeaders([ 'Foo' ])
            .setRows([ [ 'Bar' ] ])
        ;
        table.style = 'dotfull';
        table.render();

        const outputContent = this._getOutputContent(output);

        const expected =
`.......
. Foo .
.......
. Bar .
.......
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should render row separators', () => {
        const output = this._getOutputStream();

        const table = new Table(output);
        table
            .setHeaders([ 'Foo' ])
            .setRows([
                [ 'Bar1' ],
                new TableSeparator(),
                [ 'Bar2' ],
                new TableSeparator(),
                [ 'Bar3' ],
            ])
        ;
        table.render();

        const outputContent = this._getOutputContent(output);

        const expected =
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
        const output = this._getOutputStream();

        const table = new Table(output);
        table.setRows([
            [ new TableCell('foo', { colspan: 2 }) ],
        ]);
        table.render();
        table.render();
        table.render();

        const outputContent = this._getOutputContent(output);

        const expected =
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
        const output = this._getOutputStream();

        const table = new Table(output);
        table
            .setHeaders([ 'ISBN', 'Title', 'Author', 'Price' ])
            .setRows([
                [ '99921-58-10-7', 'Divine Comedy', 'Dante Alighieri', '9.95' ],
                [ '9971-5-0210-0', 'A Tale of Two Cities', 'Charles Dickens', '139.25' ],
            ])
        ;

        const style = new TableStyle();
        style.padType = __jymfony.STR_PAD_LEFT;
        table.setColumnStyle(3, style);

        table.render();

        const outputContent = this._getOutputContent(output);

        const expected =
`+---------------+----------------------+-----------------+--------+
| ISBN          | Title                | Author          |  Price |
+---------------+----------------------+-----------------+--------+
| 99921-58-10-7 | Divine Comedy        | Dante Alighieri |   9.95 |
| 9971-5-0210-0 | A Tale of Two Cities | Charles Dickens | 139.25 |
+---------------+----------------------+-----------------+--------+
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should render first and last column with specified width', () => {
        const output = this._getOutputStream();

        const table = new Table(output);
        table
            .setHeaders([ 'ISBN', 'Title', 'Author', 'Price' ])
            .setRows([
                [ '99921-58-10-7', 'Divine Comedy', 'Dante Alighieri', '9.95' ],
                [ '9971-5-0210-0', 'A Tale of Two Cities', 'Charles Dickens', '139.25' ],
            ])
            .setColumnWidth(0, 15)
            .setColumnWidth(3, 10)
        ;

        const style = new TableStyle();
        style.padType = __jymfony.STR_PAD_LEFT;
        table.setColumnStyle(3, style);

        table.render();

        const outputContent = this._getOutputContent(output);

        const expected =
`+-----------------+----------------------+-----------------+------------+
| ISBN            | Title                | Author          |      Price |
+-----------------+----------------------+-----------------+------------+
| 99921-58-10-7   | Divine Comedy        | Dante Alighieri |       9.95 |
| 9971-5-0210-0   | A Tale of Two Cities | Charles Dickens |     139.25 |
+-----------------+----------------------+-----------------+------------+
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should render columns with specified widths', () => {
        const output = this._getOutputStream();

        const table = new Table(output);
        table
            .setHeaders([ 'ISBN', 'Title', 'Author', 'Price' ])
            .setRows([
                [ '99921-58-10-7', 'Divine Comedy', 'Dante Alighieri', '9.95' ],
                [ '9971-5-0210-0', 'A Tale of Two Cities', 'Charles Dickens', '139.25' ],
            ])
            .setColumnWidths([ 15, 0, -1, 10 ])
        ;

        const style = new TableStyle();
        style.padType = __jymfony.STR_PAD_LEFT;
        table.setColumnStyle(3, style);

        table.render();

        const outputContent = this._getOutputContent(output);

        const expected =
`+-----------------+----------------------+-----------------+------------+
| ISBN            | Title                | Author          |      Price |
+-----------------+----------------------+-----------------+------------+
| 99921-58-10-7   | Divine Comedy        | Dante Alighieri |       9.95 |
| 9971-5-0210-0   | A Tale of Two Cities | Charles Dickens |     139.25 |
+-----------------+----------------------+-----------------+------------+
`;

        expect(outputContent).to.be.equal(expected);
    });

    it('should throw on undefined style', () => {
        const output = this._getOutputStream();

        const table = new Table(output);

        expect(() => table.style = 'absent').to.throw(
            InvalidArgumentException,
            'Style "absent" is not defined.'
        );
    });

    it('Table getStyle definition should throw on undefined style', () => {
        expect(() => Table.getStyleDefinition('absent')).to.throw(
            InvalidArgumentException,
            'Style "absent" is not defined.'
        );
    });

    const books = [
        [ '99921-58-10-7', 'Divine Comedy', 'Dante Alighieri' ],
        [ '9971-5-0210-0', 'A Tale of Two Cities', 'Charles Dickens' ],
        [ '960-425-059-0', 'The Lord of the Rings', 'J. R. R. Tolkien' ],
        [ '80-902734-1-6', 'And Then There Were None', 'Agatha Christie' ],
    ];

    const testItems = [
        {
            headers: [ 'ISBN', 'Title', 'Author' ],
            data: books,
            style: 'default',
            expected:
`+---------------+--------------------------+------------------+
| ISBN          | Title                    | Author           |
+---------------+--------------------------+------------------+
| 99921-58-10-7 | Divine Comedy            | Dante Alighieri  |
| 9971-5-0210-0 | A Tale of Two Cities     | Charles Dickens  |
| 960-425-059-0 | The Lord of the Rings    | J. R. R. Tolkien |
| 80-902734-1-6 | And Then There Were None | Agatha Christie  |
+---------------+--------------------------+------------------+
`,
        },
        {
            headers: [ 'ISBN', 'Title', 'Author' ],
            data: books,
            style: 'compact',
            expected:
` ISBN          Title                    Author           
 99921-58-10-7 Divine Comedy            Dante Alighieri  
 9971-5-0210-0 A Tale of Two Cities     Charles Dickens  
 960-425-059-0 The Lord of the Rings    J. R. R. Tolkien 
 80-902734-1-6 And Then There Were None Agatha Christie  
`,
        },
        {
            headers: [ 'ISBN', 'Title', 'Author' ],
            data: books,
            style: 'borderless',
            expected:
` =============== ========================== ================== 
  ISBN            Title                      Author            
 =============== ========================== ================== 
  99921-58-10-7   Divine Comedy              Dante Alighieri   
  9971-5-0210-0   A Tale of Two Cities       Charles Dickens   
  960-425-059-0   The Lord of the Rings      J. R. R. Tolkien  
  80-902734-1-6   And Then There Were None   Agatha Christie   
 =============== ========================== ================== 
`,
        },
        {
            headers: [ 'ISBN', 'Title' ],
            data: [
                [ '99921-58-10-7', 'Divine Comedy', 'Dante Alighieri' ],
                [ '9971-5-0210-0' ],
                [ '960-425-059-0', 'The Lord of the Rings', 'J. R. R. Tolkien' ],
                [ '80-902734-1-6', 'And Then There Were None', 'Agatha Christie' ],
            ],
            style: 'default',
            expected:
`+---------------+--------------------------+------------------+
| ISBN          | Title                    |                  |
+---------------+--------------------------+------------------+
| 99921-58-10-7 | Divine Comedy            | Dante Alighieri  |
| 9971-5-0210-0 |                          |                  |
| 960-425-059-0 | The Lord of the Rings    | J. R. R. Tolkien |
| 80-902734-1-6 | And Then There Were None | Agatha Christie  |
+---------------+--------------------------+------------------+
`,
        },
        {
            headers: [],
            data: [
                [ '99921-58-10-7', 'Divine Comedy', 'Dante Alighieri' ],
                [ '9971-5-0210-0' ],
                [ '960-425-059-0', 'The Lord of the Rings', 'J. R. R. Tolkien' ],
                [ '80-902734-1-6', 'And Then There Were None', 'Agatha Christie' ],
            ],
            style: 'default',
            expected:
`+---------------+--------------------------+------------------+
| 99921-58-10-7 | Divine Comedy            | Dante Alighieri  |
| 9971-5-0210-0 |                          |                  |
| 960-425-059-0 | The Lord of the Rings    | J. R. R. Tolkien |
| 80-902734-1-6 | And Then There Were None | Agatha Christie  |
+---------------+--------------------------+------------------+
`,
        },
        {
            headers: [ 'ISBN', 'Title', 'Author' ],
            data: [
                [ '99921-58-10-7', 'Divine\nComedy', 'Dante Alighieri' ],
                [ '9971-5-0210-2', 'Harry Potter\nand the Chamber of Secrets', 'Rowling\nJoanne K.' ],
                [ '9971-5-0210-2', 'Harry Potter\nand the Chamber of Secrets', 'Rowling\nJoanne K.' ],
                [ '960-425-059-0', 'The Lord of the Rings', 'J. R. R.\nTolkien' ],
            ],
            style: 'default',
            expected:
`+---------------+----------------------------+-----------------+
| ISBN          | Title                      | Author          |
+---------------+----------------------------+-----------------+
| 99921-58-10-7 | Divine                     | Dante Alighieri |
|               | Comedy                     |                 |
| 9971-5-0210-2 | Harry Potter               | Rowling         |
|               | and the Chamber of Secrets | Joanne K.       |
| 9971-5-0210-2 | Harry Potter               | Rowling         |
|               | and the Chamber of Secrets | Joanne K.       |
| 960-425-059-0 | The Lord of the Rings      | J. R. R.        |
|               |                            | Tolkien         |
+---------------+----------------------------+-----------------+
`,
        },
        {
            headers: [ 'ISBN', 'Title' ],
            data: [],
            style: 'default',
            expected:
`+------+-------+
| ISBN | Title |
+------+-------+
`,
        },
        {
            headers: [],
            data: [],
            style: 'default',
            expected: '',
        },
        {
            headers: [ 'ISBN', 'Title', 'Author' ],
            data: [
                [ '<info>99921-58-10-7</info>', '<error>Divine Comedy</error>', '<fg=blue;bg=white>Dante Alighieri</fg=blue;bg=white>' ],
                [ '9971-5-0210-0', 'A Tale of Two Cities', '<info>Charles Dickens</>' ],
            ],
            style: 'default',
            expected:
`+---------------+----------------------+-----------------+
| ISBN          | Title                | Author          |
+---------------+----------------------+-----------------+
| 99921-58-10-7 | Divine Comedy        | Dante Alighieri |
| 9971-5-0210-0 | A Tale of Two Cities | Charles Dickens |
+---------------+----------------------+-----------------+
`,
        },
        {
            headers: [ 'ISBN', 'Title', 'Author' ],
            data: [
                [ '<strong>99921-58-10-700</strong>', '<f>Divine Com</f>', 'Dante Alighieri' ],
                [ '9971-5-0210-0', 'A Tale of Two Cities', 'Charles Dickens' ],
            ],
            style: 'default',
            expected:
`+----------------------------------+----------------------+-----------------+
| ISBN                             | Title                | Author          |
+----------------------------------+----------------------+-----------------+
| <strong>99921-58-10-700</strong> | <f>Divine Com</f>    | Dante Alighieri |
| 9971-5-0210-0                    | A Tale of Two Cities | Charles Dickens |
+----------------------------------+----------------------+-----------------+
`,
        },
        {
            headers: [ 'ISBN', 'Title', 'Author' ],
            data: [
                [ '99921-58-10-7', 'Divine Comedy', 'Dante Alighieri' ],
                new TableSeparator(),
                [ new TableCell('Divine Comedy (Dante Alighieri)', { colspan: 3 }) ],
                new TableSeparator(),
                [
                    new TableCell('Arduino: A Quick-Start Guide', { colspan: 2 }),
                    'Mark Schmidt',
                ],
                new TableSeparator(),
                [
                    '9971-5-0210-0',
                    new TableCell('A Tale of \nTwo Cities', { colspan: 2 }),
                ],
                new TableSeparator(),
                [
                    new TableCell('Cupiditate dicta atque porro, tempora exercitationem modi animi nulla nemo vel nihil!', { colspan: 3 }),
                ],
            ],
            style: 'default',
            expected:
`+-------------------------------+-------------------------------+-----------------------------+
| ISBN                          | Title                         | Author                      |
+-------------------------------+-------------------------------+-----------------------------+
| 99921-58-10-7                 | Divine Comedy                 | Dante Alighieri             |
+-------------------------------+-------------------------------+-----------------------------+
| Divine Comedy (Dante Alighieri)                                                             |
+-------------------------------+-------------------------------+-----------------------------+
| Arduino: A Quick-Start Guide                                  | Mark Schmidt                |
+-------------------------------+-------------------------------+-----------------------------+
| 9971-5-0210-0                 | A Tale of                                                   |
|                               | Two Cities                                                  |
+-------------------------------+-------------------------------+-----------------------------+
| Cupiditate dicta atque porro, tempora exercitationem modi animi nulla nemo vel nihil!       |
+-------------------------------+-------------------------------+-----------------------------+
`,
        },
        {
            headers: [
                [ new TableCell('Main title', { colspan: 3 }) ],
                [ 'ISBN', 'Title', 'Author' ],
            ],
            data: [],
            style: 'default',
            expected:
`+------+-------+--------+
| Main title            |
+------+-------+--------+
| ISBN | Title | Author |
+------+-------+--------+
`,
        },
        {
            headers: [],
            data: [
                [
                    new TableCell('1', { colspan: 3 }),
                    new TableCell('2', { colspan: 2 }),
                    new TableCell('3', { colspan: 2 }),
                    new TableCell('4', { colspan: 2 }),
                ],
            ],
            style: 'default',
            expected:
`+---+--+--+---+--+---+--+---+--+
| 1       | 2    | 3    | 4    |
+---+--+--+---+--+---+--+---+--+
`,
        },
        {
            headers: [
                new TableCell('<comment>Long Title</comment>', { colspan: 3 }),
            ],
            data: [
                [ new TableCell('9971-5-0210-0', { colspan: 3 }) ],
                new TableSeparator(),
                [
                    'Dante Alighieri',
                    'J. R. R. Tolkien',
                    'J. R. R',
                ],
            ],
            style: 'default',
            decorated: true,
            expected:
`+-----------------+------------------+---------+
|${'\u001b'}[32m ${'\u001b'}[39m${'\u001b'}[33mLong Title${'\u001b'}[39m                                   |
+-----------------+------------------+---------+
| 9971-5-0210-0                                |
+-----------------+------------------+---------+
| Dante Alighieri | J. R. R. Tolkien | J. R. R |
+-----------------+------------------+---------+
`,
        },
        {
            headers: [],
            data: [
                [ new TableCell('<error>Dont break\nhere</error>', { colspan: 2 }) ],
                new TableSeparator(),
                [
                    'foo',
                    new TableCell('<error>Dont break\nhere</error>'),
                ],
            ],
            style: 'default',
            decorated: true,
            expected:
`+-------+------------+
| [37;41mDont break[39;49m[39;49m         |
| [39;49m[37;41mhere[39;49m               |
+-------+------------+
| foo   | [37;41mDont break[39;49m[39;49m |
|       | [39;49m[37;41mhere[39;49m       |
+-------+------------+
`,
        },
    ];

    let index = 1;
    for (const { headers, data, style, decorated = false, expected} of testItems) {
        it('should render table with data #' + index++, () => {
            const output = this._getOutputStream(decorated);
            const table = new Table(output);
            table
                .setHeaders(headers)
                .setRows(data)
            ;
            table.style = style;
            table.render();

            const outputContent = this._getOutputContent(output);

            expect(outputContent).to.be.equal(expected);
        });
    }

    const setTitleTests = [
        [
            'Books',
            'Page 1/2',
            'default',
            `+---------------+----------- Books --------+------------------+
| ISBN          | Title                    | Author           |
+---------------+--------------------------+------------------+
| 99921-58-10-7 | Divine Comedy            | Dante Alighieri  |
| 9971-5-0210-0 | A Tale of Two Cities     | Charles Dickens  |
| 960-425-059-0 | The Lord of the Rings    | J. R. R. Tolkien |
| 80-902734-1-6 | And Then There Were None | Agatha Christie  |
+---------------+--------- Page 1/2 -------+------------------+
`,
        ],
        [
            'Books',
            'Page 1/2',
            'box',
            `┌───────────────┬─────────── Books ────────┬──────────────────┐
│ ISBN          │ Title                    │ Author           │
├───────────────┼──────────────────────────┼──────────────────┤
│ 99921-58-10-7 │ Divine Comedy            │ Dante Alighieri  │
│ 9971-5-0210-0 │ A Tale of Two Cities     │ Charles Dickens  │
│ 960-425-059-0 │ The Lord of the Rings    │ J. R. R. Tolkien │
│ 80-902734-1-6 │ And Then There Were None │ Agatha Christie  │
└───────────────┴───────── Page 1/2 ───────┴──────────────────┘
`,
        ],
        [
            'Boooooooooooooooooooooooooooooooooooooooooooooooooooooooks',
            'Page 1/999999999999999999999999999999999999999999999999999',
            'default',
            `+- Booooooooooooooooooooooooooooooooooooooooooooooooooooo... -+
| ISBN          | Title                    | Author           |
+---------------+--------------------------+------------------+
| 99921-58-10-7 | Divine Comedy            | Dante Alighieri  |
| 9971-5-0210-0 | A Tale of Two Cities     | Charles Dickens  |
| 960-425-059-0 | The Lord of the Rings    | J. R. R. Tolkien |
| 80-902734-1-6 | And Then There Were None | Agatha Christie  |
+- Page 1/99999999999999999999999999999999999999999999999... -+
`,
        ],
    ];

    index = 1;
    for (const [ headerTitle, footerTitle, style, expected ] of setTitleTests) {
        it ('should render table with title with data #' + index++, () => {
            const output = this._getOutputStream(false);

            const table = new Table(output);
            table.headerTitle = headerTitle;
            table.footerTitle = footerTitle;
            table.setHeaders([ 'ISBN', 'Title', 'Author' ]);
            table.setRows([
                [ '99921-58-10-7', 'Divine Comedy', 'Dante Alighieri' ],
                [ '9971-5-0210-0', 'A Tale of Two Cities', 'Charles Dickens' ],
                [ '960-425-059-0', 'The Lord of the Rings', 'J. R. R. Tolkien' ],
                [ '80-902734-1-6', 'And Then There Were None', 'Agatha Christie' ],
            ]);

            table.style = style;
            table.render();

            expect(this._getOutputContent(output)).to.be.equal(expected);
        });
    }
});
