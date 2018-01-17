require('../../lib/String/strcspn');
const expect = require('chai').expect;

describe('Strcspn', function () {
    const tests = function * () {
        yield [ [ 'abcdefg123', '1234567890' ], 7 ];
        yield [ [ '123abc', '1234567890' ], 0 ];
        yield [ [ 'abcdefg123', '1234567890', 1 ], 6 ];
        yield [ [ 'abcdefg123', '1234567890', -6, -5 ], 1 ];
    };

    let count = 1;
    for (const [ args, expected ] of tests()) {
        it('should pass #'+count++, () => {
            expect(__jymfony.strcspn(...args)).to.be.equal(expected);
        });
    }
});
