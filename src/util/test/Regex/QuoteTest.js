require('../../lib/Regex/quote');
const expect = require('chai').expect;

describe('Regex quote', function () {
    it('basic', () => {
        expect(__jymfony.regex_quote('/this *-has \\ metacharacters^ in $'))
            .to.be.equal('/this \\*\\-has \\\\ metacharacters\\^ in \\$');
    });
});
