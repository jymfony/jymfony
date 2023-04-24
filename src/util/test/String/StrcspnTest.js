const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class StrcspnTest extends TestCase {
    @dataProvider('provideTests')
    testShouldWork(args, expected) {
        __self.assertEquals(expected, __jymfony.strcspn(...args));
    }

    * provideTests() {
        yield [ [ 'abcdefg123', '1234567890' ], 7 ];
        yield [ [ '123abc', '1234567890' ], 0 ];
        yield [ [ 'abcdefg123', '1234567890', 1 ], 6 ];
        yield [ [ 'abcdefg123', '1234567890', -6, -5 ], 1 ];
    }
}
