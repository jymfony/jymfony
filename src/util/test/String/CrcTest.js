require('../../lib/String/crc32');
const expect = require('chai').expect;

describe('crc32', function () {
    it('test empty', () => {
        expect(__jymfony.crc32('')).to.be.equal(0);
        expect(__jymfony.crc32(Buffer.from(''))).to.be.equal(0);
    });

    it('test vector', () => {
        expect(__jymfony.crc32('123456789')).to.be.equal(0xcbf43926);
        expect(__jymfony.crc32(Buffer.from('123456789'))).to.be.equal(0xcbf43926);
    });
});
