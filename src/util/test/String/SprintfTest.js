require('../../lib/String/sprintf');
const expect = require('chai').expect;

describe('Sprintf', function () {
    const tests = function * () {
        yield [ [ '%01.2f', 123.1 ], '123.10' ];
        yield [ [ '[%10s]', 'monkey' ], '[    monkey]' ];
        yield [ [ '[%\'#10s]', 'monkey' ], '[####monkey]' ];
        yield [ [ '%d', 123456789012345 ], '123456789012345' ];
        yield [ [ '%-03s', 'E' ], 'E00' ];
    };

    for (const [ args, expected ] of tests()) {
        it ('should correctly interpret "' + args[0] + '"', () => {
            expect(__jymfony.sprintf(...args)).to.be.equal(expected);
        });
    }
});
