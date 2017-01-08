const expect = require('chai').expect;

describe('Trim', function () {
    let expectedLeftRightTrimOutput = [
        'This is a string',
        'this is another string',
        'these spaces should be trimmed',
        'even LF and CR',
        'x00 and x0B too',
    ];

    let testLeftTrimStrings = [
        ' This is a string',
        'this is another string',
        '    these spaces should be trimmed',
        '\x0A\x0Deven LF and CR',
        '\x00\x0Bx00 and x0B too',
    ];

    it('Left spaces/CR/LF/tabs should be trimmed by ltrim', () => {
        for (let i = 0; i < testLeftTrimStrings.length; ++i) {
            expect(__jymfony.ltrim(testLeftTrimStrings[i])).to.be.equal(expectedLeftRightTrimOutput[i]);
        }
    });

    let testRightTrimStrings = [
        'This is a string ',
        'this is another string',
        'these spaces should be trimmed    ',
        'even LF and CR\x0A\x0D',
        'x00 and x0B too\x00\x0B',
    ];

    it('Right spaces/CR/LF/tabs should be trimmed by rtrim', () => {
        for (let i = 0; i < testRightTrimStrings.length; ++i) {
            expect(__jymfony.rtrim(testRightTrimStrings[i])).to.be.equal(expectedLeftRightTrimOutput[i]);
        }
    });

    let testTrimStrings = [
        ' This is a string ',
        'this is another string',
        '    these spaces should be trimmed    ',
        '\x0D\x0Aeven LF and CR\x0A\x0D',
        '\x0B\x00x00 and x0B too\x00\x0B',
    ];

    it('Spaces/CR/LF/tabs (both left and right) should be trimmed by trim', () => {
        for (let i = 0; i < testTrimStrings.length; ++i) {
            expect(__jymfony.trim(testTrimStrings[i])).to.be.equal(expectedLeftRightTrimOutput[i]);
        }
    });

    let testLeftTrimCharListStrings = [
        'Hello world!',
        'Hello Chai!',
        'Hello Mocha!',
        'NodeJS Hello!',
    ];

    let expectedLeftTrimCharListStrings = [
        ' world!',
        ' Chai!',
        ' Mocha!',
        'NodeJS Hello!',
    ];

    it('ltrim(string, ["H", "e", "l", "o"]) should left trim the "H" "e" "l" "o" chars', () => {
        for (let i = 0; i < testLeftTrimCharListStrings.length; ++i) {
            expect(__jymfony.ltrim(testLeftTrimCharListStrings[i], "Helo"))
                .to.be.equal(expectedLeftTrimCharListStrings[i])
            ;
        }
    });

    let testRightTrimCharListStrings = [
        'world! Hello',
        'Chai! Hello',
        'Mocha! Hello',
        'Hello! NodeJS',
    ];

    let expectedRightTrimCharListStrings = [
        'world! ',
        'Chai! ',
        'Mocha! ',
        'Hello! NodeJS',
    ];

    it('rtrim(string, ["H", "e", "l", "o"]) should left trim the "H" "e" "l" "o" chars', () => {
        for (let i = 0; i < testRightTrimCharListStrings.length; ++i) {
            expect(__jymfony.rtrim(testRightTrimCharListStrings[i], "Helo"))
                .to.be.equal(expectedRightTrimCharListStrings[i])
            ;
        }
    });

    let testTrimCharListStrings = [
        'Hello world! Hello',
        'Hello Chai! Hello',
        'Hello Mocha! Hello',
        'NodeJS Hello! NodeJS',
    ];

    let expectedTrimCharListStrings = [
        ' world! ',
        ' Chai! ',
        ' Mocha! ',
        'NodeJS Hello! NodeJS',
    ];

    it('trim(string, ["H", "e", "l", "o"]) should left trim the "H" "e" "l" "o" chars', () => {
        for (let i = 0; i < testTrimCharListStrings.length; ++i) {
            expect(__jymfony.trim(testTrimCharListStrings[i], "Helo"))
                .to.be.equal(expectedTrimCharListStrings[i])
            ;
        }
    });
});
