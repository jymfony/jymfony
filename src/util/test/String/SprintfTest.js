const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class SprintfTest extends TestCase {
    * provideArguments() {
        yield [ '123.10', '%01.2f', 123.1 ];
        yield [ '[    monkey]', '[%10s]', 'monkey' ];
        yield [ '[####monkey]', '[%\'#10s]', 'monkey' ];
        yield [ '123456789012345', '%d', 123456789012345 ];
        yield [ 'E00', '%-03s', 'E' ];
    };

    @dataProvider('provideArguments')
    testShouldCorrectlyInterpretFormat(expected, ...args) {
        __self.assertEquals(expected, __jymfony.sprintf(...args));
    }
}
