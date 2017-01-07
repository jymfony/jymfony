require('../../lib/Function/BoundFunction');
const expect = require('chai').expect;

class TestObject {
    constructor(val) {
        this._val = val;
    }

    foo() {
        return this._val;
    }

    * generator() {
        return this._val;
    }
}

describe('BoundFunction', function () {
    it('call should ignore thisArg', () => {
        let bf = new BoundFunction(new TestObject('foobar'), TestObject.prototype.foo);
        expect(bf.call(new TestObject('bar'))).to.be.equal('foobar');
    });

    it('apply should ignore thisArg', () => {
        let bf = new BoundFunction(new TestObject('foobar'), TestObject.prototype.foo);
        expect(bf.apply(new TestObject('bar'))).to.be.equal('foobar');
    });

    it('GeneratorFunction should be called', () => {
        let bf = new BoundFunction(new TestObject('foobar'), TestObject.prototype.generator);
        let retVal = bf();

        expect(isGenerator(retVal)).to.be.true;
        let ret = retVal.next().value;
        expect(ret).to.be.equal('foobar');
    });

    it('should throw if argument is not a function', () => {
        try {
            new BoundFunction(new TestObject('val'), 'foo');
        } catch (e) {
            expect(e).to.be.instanceOf(LogicException);
            return;
        }

        throw new Error('FAIL');
    });

    it('equals should work', () => {
        let o = new TestObject('foobar');
        let func1 = new BoundFunction(o, TestObject.prototype.foo);
        let func2 = new BoundFunction(o, TestObject.prototype.foo);

        expect(func1.equals(func2)).to.be.true;
    });

    it('equals should compare array callables', () => {
        let o = new TestObject('foobar');
        let func = new BoundFunction(o, TestObject.prototype.foo);

        expect(func.equals([o, 'foo'])).to.be.true;
    });

    it('equals should return false if not a BoundFunction is passed', () => {
        let o = new TestObject('foobar');
        let func = new BoundFunction(o, TestObject.prototype.foo);

        expect(func.equals(TestObject.prototype.foo)).to.be.false;
    });
});
