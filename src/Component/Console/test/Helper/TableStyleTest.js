const expect = require('chai').expect;

const TableStyle = Jymfony.Component.Console.Helper.TableStyle;

describe('[Console] TableStyle', function () {
    it('constructor', () => {
        let tableStyle = new TableStyle();

        expect(tableStyle.getPaddingChar()).to.be.equal(' ');
        expect(tableStyle.getHorizontalBorderChar()).to.be.equal('-');
        expect(tableStyle.getVerticalBorderChar()).to.be.equal('|');
        expect(tableStyle.getCrossingChar()).to.be.equal('+');
        expect(tableStyle.getCellHeaderFormat()).to.be.equal('<info>%s</info>');
        expect(tableStyle.getCellRowFormat()).to.be.equal('%s');
        expect(tableStyle.getCellRowContentFormat()).to.be.equal(' %s ');
        expect(tableStyle.getBorderFormat()).to.be.equal('%s');
    });
});
