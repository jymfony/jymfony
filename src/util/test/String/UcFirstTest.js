const expect = require('chai').expect;

describe('Uppercase first character', function () {
    let testStrings = [
        'hey',
        'mate',
        'what\'s',
        'up?',
        'Everything',
        'iS',
        'goOD?',
        'YES',
        'IT',
        'IS',
    ];

    let expectedStrings = [
        'Hey',
        'Mate',
        'What\'s',
        'Up?',
        'Everything',
        'IS',
        'GoOD?',
        'YES',
        'IT',
        'IS',
    ];

    it('ucfirst should upper case only the first char', () => {
        for (let i = 0; i < testStrings.length; ++i) {
            expect(__jymfony.ucfirst(testStrings[i])).to.be.equal(expectedStrings[i]);
        }
    });
});
