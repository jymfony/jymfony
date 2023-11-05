const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export class BadMethodCallExceptionTest extends TestCase {
    get testCaseName() {
        return '[Exceptions] ' + super.testCaseName;
    }

    testShouldBeRegisteredInGlobalNamespace() {
        __self.assertNotUndefined(BadMethodCallException);
    }

    testIsInstanceOfException() {
        __self.assertInstanceOf(Exception, new BadMethodCallException());
    }
}
