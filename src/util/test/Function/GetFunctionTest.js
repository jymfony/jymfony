const TestCase = Jymfony.Component.Testing.Framework.TestCase;

class TestObject {
    foo() { }
    static bar() { }
}

export default class GetFunctionTest extends TestCase {
    testShouldRetrieveFunctionFromObject() {
        const fn = __jymfony.getFunction(new TestObject(), 'foo');
        __self.assertIsFunction(fn);
        __self.assertEquals(TestObject.prototype.foo, fn.innerObject._func);
    }

    async testShouldRetrieveStaticFunctionFromObject() {
        const fn = __jymfony.getFunction(new TestObject(), 'bar');
        __self.assertIsFunction(fn);
        __self.assertEquals(TestObject.bar, fn);
    }

    testShouldThrowIfNotFound() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Cannot retrieve function non-existent from TestObject');
        __jymfony.getFunction(new TestObject(), 'non-existent');
    }
}
