const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class InvalidArgumentExceptionTest extends TestCase {
    get testCaseName() {
        return '[Contracts] Metadata.Exception.InvalidArgumentException';
    }

    @dataProvider('provideArguments')
    testShouldRenderCorrectMessage(expected, ...args) {
        __self.assertEquals(expected, InvalidArgumentException.create(...args).message);
    }

    * provideArguments() {
        yield [ 'Class NonExistentTestClass does not exist, cannot retrieve its metadata', InvalidArgumentException.CLASS_DOES_NOT_EXIST, 'NonExistentTestClass' ];
        yield [ 'Unknown reason', 'Unknown reason' ];
        yield [ 'Printed string', 'Printed %s', 'string' ];
        yield [ 'Cannot create metadata for non-objects. "number" passed.', InvalidArgumentException.VALUE_IS_NOT_AN_OBJECT, 2 ];
    }
}
