require('../../lib/String/strtr');
const expect = require('chai').expect;

describe('Strtr', function () {
    it('should work correctly', () => {
        const trans = {'hello': 'hi', 'hi': 'hello', 'a': 'A', 'world': 'planet'};
        expect(__jymfony.strtr('# hi all, I said hello world! #', trans))
            .to.be.equal('# hello All, I sAid hi planet! #');
    });

    it('should work correctly with regex special chars', () => {
        const trans = {'hello': 'hi', '\\hi?': 'hello#', '(a': ')A', 'world': 'planet'};
        expect(__jymfony.strtr('# \\hi? (all), I said hello world! #', trans))
            .to.be.equal('# hello# )All), I said hi planet! #');
    });
});
