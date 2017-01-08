require('../../lib/String/levenshtein');
const expect = require('chai').expect;

describe('Levenshtein distance', function () {
    it('equals', () => { expect(__jymfony.levenshtein('12345', '12345')).to.be.equal(0); });
    it('1st empty', () => { expect(__jymfony.levenshtein('', 'xyz')).to.be.equal(3); });
    it('2nd empty', () => { expect(__jymfony.levenshtein('xyz', '')).to.be.equal(3); });
    it('both empty', () => { expect(__jymfony.levenshtein('', '')).to.be.equal(0); });
    it('1 char', () => { expect(__jymfony.levenshtein('1', '2')).to.be.equal(1); });
    it('2 char swap', () => { expect(__jymfony.levenshtein('12', '21')).to.be.equal(2); });

    it('delete', () => { expect(__jymfony.levenshtein('2121', '11')).to.be.equal(2); });
    it('insert', () => { expect(__jymfony.levenshtein('11', '2121')).to.be.equal(2); });
    it('replace', () => { expect(__jymfony.levenshtein('121', '111')).to.be.equal(1); });
});
