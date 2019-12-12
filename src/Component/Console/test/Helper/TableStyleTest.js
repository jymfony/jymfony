const expect = require('chai').expect;

const TableStyle = Jymfony.Component.Console.Helper.TableStyle;

describe('[Console] TableStyle', function () {
    it('constructor', () => {
        const tableStyle = new TableStyle();

        expect(tableStyle.paddingChar).to.be.equal(' ');
        expect(tableStyle.borderChars).to.be.deep.equal([ '-', '|', '-', '|' ]);
        expect(tableStyle.crossingChar).to.be.equal('+');
        expect(tableStyle.cellHeaderFormat).to.be.equal('<info>%s</info>');
        expect(tableStyle.cellRowFormat).to.be.equal('%s');
        expect(tableStyle.cellRowContentFormat).to.be.equal(' %s ');
        expect(tableStyle.borderFormat).to.be.equal('%s');
    });
});
