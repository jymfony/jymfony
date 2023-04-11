const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const expectedLeftRightTrimOutput = [
    'This is a string',
    'this is another string',
    'these spaces should be trimmed',
    'even LF and CR',
    'x00 and x0B too',
];

export default class TrimTest extends TestCase {
    testLeftSpacesCRLFTabsShouldBeTrimmedByLtrim() {
        const testLeftTrimStrings = [
            ' This is a string',
            'this is another string',
            '    these spaces should be trimmed',
            '\x0A\x0Deven LF and CR',
            '\x00\x0Bx00 and x0B too',
        ];

        for (let i = 0; i < testLeftTrimStrings.length; ++i) {
            __self.assertEquals(expectedLeftRightTrimOutput[i], __jymfony.ltrim(testLeftTrimStrings[i]));
        }
    }

    testRightSpacesCRLFTabsShouldBeTrimmedByRtrim() {
        const testRightTrimStrings = [
            'This is a string ',
            'this is another string',
            'these spaces should be trimmed    ',
            'even LF and CR\x0A\x0D',
            'x00 and x0B too\x00\x0B',
        ];

        for (let i = 0; i < testRightTrimStrings.length; ++i) {
            __self.assertEquals(expectedLeftRightTrimOutput[i], __jymfony.rtrim(testRightTrimStrings[i]));
        }
    }

    testSpacesCRLFtabsLeftAndRightShouldBeTrimmedByTrim() {
        const testTrimStrings = [
            ' This is a string ',
            'this is another string',
            '    these spaces should be trimmed    ',
            '\x0D\x0Aeven LF and CR\x0A\x0D',
            '\x0B\x00x00 and x0B too\x00\x0B',
        ];

        for (let i = 0; i < testTrimStrings.length; ++i) {
            __self.assertEquals(expectedLeftRightTrimOutput[i], __jymfony.trim(testTrimStrings[i]));
        }
    }

    testLtrimCharsShouldLeftTrimTheSpecifiedChars() {
        const testLeftTrimCharListStrings = [
            'Hello world!',
            'Hello Chai!',
            'Hello Mocha!',
            'NodeJS Hello!',
        ];

        const expectedLeftTrimCharListStrings = [
            ' world!',
            ' Chai!',
            ' Mocha!',
            'NodeJS Hello!',
        ];

        for (let i = 0; i < testLeftTrimCharListStrings.length; ++i) {
            __self.assertEquals(expectedLeftTrimCharListStrings[i], __jymfony.ltrim(testLeftTrimCharListStrings[i], 'Helo'));
        }
    }

    testRtrimCharsShouldRightTrimTheSpecifiedChars() {
        const testRightTrimCharListStrings = [
            'world! Hello',
            'Chai! Hello',
            'Mocha! Hello',
            'Hello! NodeJS',
        ];

        const expectedRightTrimCharListStrings = [
            'world! ',
            'Chai! ',
            'Mocha! ',
            'Hello! NodeJS',
        ];

        for (let i = 0; i < testRightTrimCharListStrings.length; ++i) {
            __self.assertEquals(expectedRightTrimCharListStrings[i], __jymfony.rtrim(testRightTrimCharListStrings[i], 'Helo'));
        }
    }

    testTrimCharsShouldTrimTheSpecifiedChars() {
        const testTrimCharListStrings = [
            'Hello world! Hello',
            'Hello Chai! Hello',
            'Hello Mocha! Hello',
            'NodeJS Hello! NodeJS',
        ];

        const expectedTrimCharListStrings = [
            ' world! ',
            ' Chai! ',
            ' Mocha! ',
            'NodeJS Hello! NodeJS',
        ];

        for (let i = 0; i < testTrimCharListStrings.length; ++i) {
            __self.assertEquals(expectedTrimCharListStrings[i], __jymfony.trim(testTrimCharListStrings[i], 'Helo'));
        }
    }
}
