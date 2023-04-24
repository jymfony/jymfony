const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class StrPadTest extends TestCase {
    @dataProvider('providePadTests')
    testShouldCorrectlyPadString(args, expected) {
        __self.assertEquals(expected, __jymfony.str_pad(...args));
    }

    * providePadTests() {
        yield [ [ 'space', 5 ], 'space' ];
        yield [ [ 'space', 10 ], 'space     ' ];
        yield [ [ 'space', 10, ' ', __jymfony.STR_PAD_RIGHT ], 'space     ' ];
        yield [ [ 'space', 10, '0', __jymfony.STR_PAD_RIGHT ], 'space00000' ];
        yield [ [ 'space', 10, '0', __jymfony.STR_PAD_LEFT ], '00000space' ];
        yield [ [ 'space', 15, '0', __jymfony.STR_PAD_BOTH ], '00000space00000' ];
        yield [ [ 'space', 16, '0', __jymfony.STR_PAD_BOTH ], '00000space000000' ];
    }

    testShouldThrowIfInvalidPadType() {
        this.expectException(InvalidArgumentException);
        __jymfony.str_pad('space', 15, ' ', 'I am not a valid pad type');
    }
}
