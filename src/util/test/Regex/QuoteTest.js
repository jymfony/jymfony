require('../../lib/Regex/quote');
const expect = require('chai').expect;

describe('Regex quote', function () {
    it('basic', () => {
        expect(__jymfony.regex_quote('/this *-has \\ metacharacters^ in $'))
            .to.be.equal('/this \\*\\-has \\\\ metacharacters\\^ in \\$');
    });

    if (! __jymfony.Platform.hasModernRegex()) {
        it('native regex instanceof named regex should return true', () => {
            expect(/23/gi instanceof RegExp).to.be.true;
        });
    }
});
