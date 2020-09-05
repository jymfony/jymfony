const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const File = Jymfony.Component.Validator.Constraints.File;
const { expect } = require('chai');

describe('[Validator] Constraints.File', function () {
    const validSizes = [
        [ '500', 500, false ],
        [ 12300, 12300, false ],
        [ '1ki', 1024, true ],
        [ '1KI', 1024, true ],
        [ '2k', 2000, false ],
        [ '2K', 2000, false ],
        [ '1mi', 1048576, true ],
        [ '1MI', 1048576, true ],
        [ '3m', 3000000, false ],
        [ '3M', 3000000, false ],
        [ '1gi', 1073741824, true ],
        [ '1GI', 1073741824, true ],
        [ '4g', 4000000000, false ],
        [ '4G', 4000000000, false ],
    ];

    let i = 0;
    for (const [ maxSize, bytes, binaryFormat ] of validSizes) {
        it('max size should set binary format correctly #' + ++i, () => {
            const file = new File({ maxSize: maxSize });

            expect(file.maxSize, bytes);
            expect(file.binaryFormat, binaryFormat);
        });

        it ('max size can be set after initialization #' + i, () => {
            const file = new File();
            file.maxSize = maxSize;

            expect(file.maxSize, bytes);
            expect(file.binaryFormat, binaryFormat);
        });
    }

    const invalidValues = [
        '+100',
        'foo',
        '1Ko',
        '1kio',
    ];

    i = 0;
    for (const maxSize of invalidValues) {
        it ('invalid value for max size throws exception after initialization #' + ++i, () => {
            const file = new File({ maxSize: 1000 });
            expect(() => file.maxSize = maxSize).to.throw(ConstraintDefinitionException);
            expect(file.maxSize).to.be.equal(1000);
        });

        it ('should throw trying to set invalid value for max size on initialization #' + i, () => {
            expect(() => new File({ maxSize: maxSize })).to.throw(ConstraintDefinitionException);
        });
    }

    const formats = [
        [ 100, undefined, false ],
        [ 100, true, true ],
        [ 100, false, false ],
        [ '100K', undefined, false ],
        [ '100K', true, true ],
        [ '100K', false, false ],
        [ '100Ki', undefined, true ],
        [ '100Ki', true, true ],
        [ '100Ki', false, false ],
    ];

    i = 0;
    for (const [ maxSize, guessedFormat, binaryFormat ] of formats) {
        it('should set binary format correctly #' + ++i, () => {
            const file = new File({ maxSize, binaryFormat: guessedFormat });
            expect(file.binaryFormat).to.be.equal(binaryFormat);
        });
    }
});
