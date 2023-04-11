const TestCase = Jymfony.Component.Testing.Framework.TestCase;

class TestObject {
    foo() {
        return 'foo';
    }

    * gen() {
        yield 'bar';
    }
}

export default class CallableArrayTest extends TestCase {
    @dataProvider('provideInvalidArguments')
    testIsCallableArrayShouldReturnFalseIfInvalidArgumentIsPassed(...args) {
        __self.assertFalse(isCallableArray(...args));
    }

    * provideInvalidArguments() {
        yield [ 'foo' ];
        yield [ [] ];
        yield [ [ 'test', 'foo', 'bar' ] ];
        yield [ {foo: 'foo', bar: 'bar'} ];
        yield [ new TestObject(), undefined ];
    };

    * provideValidArguments() {
        yield [ [ new TestObject(), 'foo' ] ];
        yield [ [ new TestObject(), 'gen' ] ];
    }

    @dataProvider('provideValidArguments')
    testIsCallableArrayShouldWork(...args) {
        __self.assertTrue(isCallableArray(...args));
    }

    testGetCallableArrayThrowsIfInvalidArgumentIsPassed() {
        this.expectException(LogicException);
        getCallableFromArray('foo');
    }
}
