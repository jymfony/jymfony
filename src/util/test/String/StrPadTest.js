require('../../lib/String/str_pad');
const expect = require('chai').expect;

describe('String Pad', function () {
    const tests = function * () {
        yield [ [ 'space', 5 ], 'space' ];
        yield [ [ 'space', 10 ], 'space     ' ];
        yield [ [ 'space', 10, ' ', __jymfony.STR_PAD_RIGHT ], 'space     ' ];
        yield [ [ 'space', 10, '0', __jymfony.STR_PAD_RIGHT ], 'space00000' ];
        yield [ [ 'space', 10, '0', __jymfony.STR_PAD_LEFT ], '00000space' ];
        yield [ [ 'space', 15, '0', __jymfony.STR_PAD_BOTH ], '00000space00000' ];
        yield [ [ 'space', 16, '0', __jymfony.STR_PAD_BOTH ], '00000space000000' ];
    };

    for (const [ args, expected ] of tests()) {
        it('should correctly pad "' + args[0] + '" into ' + expected, () => {
            expect(__jymfony.str_pad(...args)).to.be.equal(expected);
        });
    }

    it('should throw if invalid pad type', () => {
        expect(() => __jymfony.str_pad('space', 15, ' ', 'I am not a valid pad type')).to.throw(InvalidArgumentException);
    });
});
