require('../../lib/Function/BoundFunction');
const { expect } = require('chai');

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
        const bf = new BoundFunction(new TestObject('foobar'), TestObject.prototype.foo);
        expect(bf.call(new TestObject('bar'))).to.be.equal('foobar');
    });

    it('apply should ignore thisArg', () => {
        const bf = new BoundFunction(new TestObject('foobar'), TestObject.prototype.foo);
        expect(bf.apply(new TestObject('bar'))).to.be.equal('foobar');
    });

    it('GeneratorFunction should be called', () => {
        const bf = new BoundFunction(new TestObject('foobar'), TestObject.prototype.generator);
        const retVal = bf();

        expect(isGenerator(retVal)).to.be.true;
        const ret = retVal.next().value;
        expect(ret).to.be.equal('foobar');
    });

    it('should throw if argument is not a function', () => {
        expect(() => new BoundFunction(new TestObject('val'), 'foo')).to.throw(LogicException);
    });

    it('equals should work', () => {
        const o = new TestObject('foobar');
        const func1 = new BoundFunction(o, TestObject.prototype.foo);
        const func2 = new BoundFunction(o, TestObject.prototype.foo);

        expect(func1.equals(func2)).to.be.true;
    });

    it('equals should compare array callables', () => {
        const o = new TestObject('foobar');
        const func = new BoundFunction(o, TestObject.prototype.foo);

        expect(func.equals([ o, 'foo' ])).to.be.true;
    });

    it('equals should return false if not a BoundFunction is passed', () => {
        const o = new TestObject('foobar');
        const func = new BoundFunction(o, TestObject.prototype.foo);

        expect(func.equals(TestObject.prototype.foo)).to.be.false;
    });
});
