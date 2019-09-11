require('../../lib/Function/callableArray');
const { expect } = require('chai');

class TestObject {
    foo() {
        return 'foo';
    }

    * gen() {
        yield 'bar';
    }
}

describe('callable array', function () {
    let tests = [
        [ 'foo' ],
        [ [] ],
        [ [ 'test', 'foo', 'bar' ] ],
        [ { foo: 'foo', bar: 'bar' } ],
        [ new TestObject(), undefined ],
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('isCallableArray should return false if invalid argument is passed with data #'+index, () => {
            expect(isCallableArray(...t)).to.be.false;
        });
    }

    tests = [
        [ [ new TestObject(), 'foo' ] ],
        [ [ new TestObject(), 'gen' ] ],
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('isCallableArray should work with data #'+index, () => {
            expect(isCallableArray(...t)).to.be.true;
        });
    }

    it('getCallableArray throws if invalid argument is passed', () => {
        expect(getCallableFromArray.bind(undefined, 'foo')).to.throw(LogicException);
    });
});
