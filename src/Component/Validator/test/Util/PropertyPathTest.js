const PropertyPath = Jymfony.Component.Validator.Util.PropertyPath;
const { expect } = require('chai');

describe('[Validator] PropertyPath', function () {
    const data = [
        [ 'foo', '', 'foo', 'It returns the basePath if subPath is empty' ],
        [ '', 'bar', 'bar', 'It returns the subPath if basePath is empty' ],
        [ 'foo', 'bar', 'foo.bar', 'It append the subPath to the basePath' ],
        [ 'foo', '[bar]', 'foo[bar]', 'It does not include the dot separator if subPath uses the array notation' ],
        [ '0', 'bar', '0.bar', 'Leading zeros are kept.' ],
        [ '0', 1, '0.1', 'Numeric subpaths do not cause errors.' ],
    ];

    let i = 0;
    for (const [ basePath, subPath, expectedPath, message ] of data) {
        it('append should work #' + ++i, () => {
            expect(PropertyPath.append(basePath, subPath)).to.be.equal(expectedPath, message);
        });
    }
});
