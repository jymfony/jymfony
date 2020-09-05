const Type = Jymfony.Component.Validator.Constraints.Type;
const TypeValidator = Jymfony.Component.Validator.Constraints.TypeValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.TypeValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(TypeValidator)
            .with.constraint(new Type('integer'))
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(TypeValidator)
            .with.constraint(new Type('integer'))
            .and.raise.no.violations();
    });

    it ('empty string should be valid if string', async () => {
        await expect('').to.be.validated.by(TypeValidator)
            .with.constraint(new Type('string'))
            .and.raise.no.violations();
    });

    it ('empty string should be invalid if non-string', async () => {
        await expect('').to.be.validated.by(TypeValidator)
            .with.constraint(new Type('integer'))
            .and.raise.violations([ {
                message: 'This value should be of type {{ type }}.',
                code: Type.INVALID_TYPE_ERROR,
                parameters: {
                    '{{ value }}': '""',
                    '{{ type }}': 'integer',
                },
                propertyPath: '',
            } ]);
    });

    const validValues = [
        [ true, 'Boolean' ],
        [ false, 'Boolean' ],
        [ true, 'boolean' ],
        [ false, 'boolean' ],
        [ true, 'bool' ],
        [ false, 'bool' ],
        [ 0, 'numeric' ],
        [ '0', 'numeric' ],
        [ 1.5, 'numeric' ],
        [ '1.5', 'numeric' ],
        [ 0, 'integer' ],
        [ 1.5, 'float' ],
        [ '12345', 'string' ],
        [ [], 'array' ],
        [ {}, 'object' ],
        [ new Type({ type: 'string' }), Type ],
        [ new Type({ type: 'string' }), 'Jymfony.Component.Validator.Constraints.Type' ],
    ];

    const invalidValues = [
        [ 'foobar', 'numeric', '"foobar"' ],
        [ 'foobar', 'boolean', '"foobar"' ],
        [ '0', 'integer', '"0"' ],
        [ '1.5', 'float', '"1.5"' ],
        [ 12345, 'string', '12345' ],
        [ {}, 'boolean', 'object' ],
        [ {}, 'numeric', 'object' ],
        [ {}, 'integer', 'object' ],
        [ {}, 'float', 'object' ],
        [ {}, 'string', 'object' ],
        [ [], 'boolean', 'array' ],
        [ [], 'numeric', 'array' ],
        [ [], 'integer', 'array' ],
        [ [], 'float', 'array' ],
        [ [], 'string', 'array' ],
        [ [], 'object', 'array' ],
    ];

    let i = 0;
    for (const [ value, type ] of validValues) {
        it('should validate types #' + ++i, async () => {
            await expect(value).to.be.validated.by(TypeValidator)
                .with.constraint(new Type(type))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ value, type, asText ] of invalidValues) {
        it('invalid value should raise violation #' + ++i, async () => {
            await expect(value).to.be.validated.by(TypeValidator)
                .with.constraint(new Type(type))
                .and.raise.violations([ {
                    message: 'This value should be of type {{ type }}.',
                    code: Type.INVALID_TYPE_ERROR,
                    parameters: {
                        '{{ value }}': asText,
                        '{{ type }}': type,
                    },
                    propertyPath: '',
                } ]);
        });
    }
});
