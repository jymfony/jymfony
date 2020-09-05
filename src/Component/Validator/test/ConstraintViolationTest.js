const ConstraintViolation = Jymfony.Component.Validator.ConstraintViolation;
const { expect } = require('chai');

describe('[Validator] ConstraintViolation', function () {
    it ('string conversion should handle arrays', () => {
        const violation = new ConstraintViolation(
            'Array',
            '{{ value }}',
            { '{{ value }}': [ 1, 2, 3 ] },
            'Root',
            'property.path',
            null
        );

        const expected =
`Root.property.path:
    Array`;

        expect(String(violation)).to.be.equal(expected);
    });

    it ('string conversion should handle object roots', () => {
        const violation = new ConstraintViolation(
            '42 cannot be used here',
            'this is the message template',
            [],
            { some_value: 42 },
            'some_value',
            null
        );

        const expected =
`Object.some_value:
    42 cannot be used here`;

        expect(String(violation)).to.be.equal(expected);
    });

    it ('string conversion should handle codes', () => {
        const violation = new ConstraintViolation(
            '42 cannot be used here',
            'this is the message template',
            [],
            { some_value: 42 },
            'some_value',
            null,
            null,
            '0'
        );

        const expected =
`Object.some_value:
    42 cannot be used here (code 0)`;

        expect(String(violation)).to.be.equal(expected);
    });

    it ('string conversion should ignore empty codes', () => {
        const violation = new ConstraintViolation(
            '42 cannot be used here',
            'this is the message template',
            [],
            { some_value: 42 },
            'some_value',
            null,
            null,
            ''
        );

        const expected =
`Object.some_value:
    42 cannot be used here`;

        expect(String(violation)).to.be.equal(expected);
    });

    it ('message could be a stringable object', () => {
        const message = {
            toString() {
                return 'toString';
            },
        };

        const violation = new ConstraintViolation(
            message,
            'this is the message template',
            [],
            { some_value: 42 },
            'some_value',
            null,
            null,
            ''
        );

        const expected =
`Object.some_value:
    toString`;

        expect(String(violation)).to.be.equal(expected);
        expect(violation.message).to.be.equal('toString');
    });
});
