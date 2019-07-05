require('../../lib/String/htmlentities');
const expect = require('chai').expect;

describe('htmlentities', function () {
    it('should pass example 1', () => {
        expect(__jymfony.htmlentities('Kevin & van Zonneveld')).to.be.equal( 'Kevin &amp; van Zonneveld');
    });

    it('should pass example 2', () => {
        expect(__jymfony.htmlentities('foo\'bar', 'ENT_QUOTES')).to.be.equal('foo&#39;bar');
    });
});
