const Unique = Jymfony.Component.Validator.Constraints.Unique;
const UniqueValidator = Jymfony.Component.Validator.Constraints.UniqueValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.UniqueValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(UniqueValidator)
            .with.constraint(new Unique())
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(UniqueValidator)
            .with.constraint(new Unique())
            .and.raise.no.violations();
    });

    const validValues = [
        [],
        {},
        [ 5 ],
        [ 'a' ],
        [ null ],
        [ [] ],
        [ {} ],
        [ 1, 2, 3, 4, 5, 6 ],
        [ 0.1, 0.2, 0.3, 0.4 ],
        [ 'a', 'b', 'c' ],
        [ [ 1, 2 ], [ 2, 4 ], [ 4, 6 ] ],
        [ {}, {} ],
    ];

    const obj = {};
    const invalidValues = [
        [ [ true, true ], 'true' ],
        [ [ 1, 2, 3, 3 ], '3' ],
        [ [ 0.1, 0.2, 0.1 ], '0.1' ],
        [ [ 'a', 'b', 'a' ], '"a"' ],
        [ [ [ 1, 1 ], [ 2, 3 ], [ 1, 1 ] ], 'array' ],
        [ [ obj, obj ], 'object' ],
    ];

    let i = 0;
    for (const value of validValues) {
        it('should validate regex #' + ++i, async () => {
            await expect(value).to.be.validated.by(UniqueValidator)
                .with.constraint(new Unique())
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ value, asText ] of invalidValues) {
        it('invalid value should raise violation #' + ++i, async () => {
            await expect(value).to.be.validated.by(UniqueValidator)
                .with.constraint(new Unique({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Unique.IS_NOT_UNIQUE,
                    parameters: {
                        '{{ value }}': asText,
                    },
                    propertyPath: '',
                } ]);
        });
    }
});
