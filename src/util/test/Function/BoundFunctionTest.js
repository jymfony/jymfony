const TestCase = Jymfony.Component.Testing.Framework.TestCase;

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

export default class BoundFunctionTest extends TestCase {
    testCallShouldIgnoreThisArg() {
        const bf = new BoundFunction(new TestObject('foobar'), TestObject.prototype.foo);
        __self.assertEquals('foobar', bf.call(new TestObject('bar')));
    }

    testApplyShouldIgnoreThisArg() {
        const bf = new BoundFunction(new TestObject('foobar'), TestObject.prototype.foo);
        __self.assertEquals('foobar', bf.apply(new TestObject('bar')));
    }

    testGeneratorFunctionShouldBeCalled() {
        const bf = new BoundFunction(new TestObject('foobar'), TestObject.prototype.generator);
        const retVal = bf();

        __self.assertTrue(isGenerator(retVal));
        const ret = retVal.next().value;
        __self.assertEquals('foobar', ret);
    }

    testShouldThrowIfArgumentIsNotAFunction() {
        this.expectException(LogicException);
        new BoundFunction(new TestObject('val'), 'foo');
    }

    testEqualsShouldWork() {
        const o = new TestObject('foobar');
        const func1 = new BoundFunction(o, TestObject.prototype.foo);
        const func2 = new BoundFunction(o, TestObject.prototype.foo);

        __self.assertTrue(func1.equals(func2));
    }

    testEqualsShouldCompareArrayCallables() {
        const o = new TestObject('foobar');
        const func = new BoundFunction(o, TestObject.prototype.foo);

        __self.assertTrue(func.equals([ o, 'foo' ]));
    }

    testEqualsShouldReturnFalseIfNotABoundFunctionIsPassed() {
        const o = new TestObject('foobar');
        const func = new BoundFunction(o, TestObject.prototype.foo);

        __self.assertFalse(func.equals(TestObject.prototype.foo));
    }
}
