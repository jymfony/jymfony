const Regex = Jymfony.Component.Validator.Constraints.Regex;
const { expect } = require('chai');

describe('[Validator] Constraints.Regex', function () {
    it ('pattern is defaultOption', async () => {
        const constraint = new Regex(/^[0-9]+$/);
        expect(constraint.pattern).to.be.deep.equal(/^[0-9]+$/);
    });

    const htmlPatterns = [
        // HTML5 wraps the pattern in ^(?:pattern)$
        [ /^[0-9]+$/, '[0-9]+' ],
        [ /[0-9]+$/, '.*[0-9]+' ],
        [ /^[0-9]+/, '[0-9]+.*' ],
        [ /[0-9]+/, '.*[0-9]+.*' ],
        // We need a smart way to allow matching of patterns that contain
        // ^ and $ at various sub-clauses of an or-clause
        // .*(pattern).* seems to work correctly
        [ /[0-9]$|[a-z]+/, '.*([0-9]$|[a-z]+).*' ],
        [ /[0-9]$|^[a-z]+/, '.*([0-9]$|^[a-z]+).*' ],
        [ /^[0-9]|[a-z]+$/, '.*(^[0-9]|[a-z]+$).*' ],
        // Unescape escaped delimiters
        [ /^[0-9]+\/$/, '[0-9]+/' ],
        // Cannot be converted
        [ /^[0-9]+$/i, null ],

        // Inverse matches are simple, just wrap in
        // ((?!pattern).)*
        [ /^[0-9]+$/, '((?!^[0-9]+$).)*', false ],
        [ /[0-9]+$/, '((?![0-9]+$).)*', false ],
        [ /^[0-9]+/, '((?!^[0-9]+).)*', false ],
        [ /[0-9]+/, '((?![0-9]+).)*', false ],
        [ /[0-9]$|[a-z]+/, '((?![0-9]$|[a-z]+).)*', false ],
        [ /[0-9]$|^[a-z]+/, '((?![0-9]$|^[a-z]+).)*', false ],
        [ /^[0-9]|[a-z]+$/, '((?!^[0-9]|[a-z]+$).)*', false ],
        [ /^[0-9]+\/$/, '((?!^[0-9]+/$).)*', false ],
        [ /^[0-9]+$/i, null, false ],
    ];

    let i = 0;
    for (const [ pattern, htmlPattern, match = true ] of htmlPatterns) {
        it ('should generate html pattern correctly #' + ++i, () => {
            const constraint = new Regex({ pattern, match });

            expect(constraint.pattern).to.be.equal(pattern);
            expect(constraint.getHtmlPattern()).to.be.equal(htmlPattern);
        });
    }

    it ('normalizer can be set', async () => {
        const constraint = new Regex({ pattern: /[a-z]/, normalizer: __jymfony.trim });
        expect(constraint.normalizer).to.be.equal(__jymfony.trim);
    });

    it ('should throw trying to set invalid normalizer', () => {
        expect(() => new Regex({ pattern: /[a-z]/, normalizer: 'foobar' }))
            .to.throw(InvalidArgumentException, 'The "normalizer" option must be a valid callable ("string" given).');

        expect(() => new Regex({ pattern: /[a-z]/, normalizer: {} }))
            .to.throw(InvalidArgumentException, 'The "normalizer" option must be a valid callable ("object" given).');
    });
});
