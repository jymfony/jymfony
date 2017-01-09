require('../../lib/Function/callableArray');
const expect = require('chai').expect;

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
        [ ['test', 'foo', 'bar'] ],
        [ { foo: 'foo', bar: 'bar' } ],
        [ new TestObject(), undefined ],
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('isCallableArray should return false if invalid argument is passed with data #'+index, () => {
            expect(isCallableArray.apply(undefined, t)).to.be.false;
        });
    }

    tests = [
        [ [ new TestObject(), 'foo' ] ],
        [ [ new TestObject(), 'gen' ] ],
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('isCallableArray should work with data #'+index, () => {
            expect(isCallableArray.apply(undefined, t)).to.be.true;
        });
    }

    it('getCallableArray throws if invalid argument is passed', () => {
        try {
            getCallableFromArray('foo');
        } catch (e) {
            expect(e).to.be.instanceOf(LogicException);

            return;
        }

        throw new Error('FAIL');
    })
});
