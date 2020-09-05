const All = Jymfony.Component.Validator.Constraints.All;
const AllValidator = Jymfony.Component.Validator.Constraints.AllValidator;
const IsNull = Jymfony.Component.Validator.Constraints.IsNull;
const NotNull = Jymfony.Component.Validator.Constraints.NotNull;
const Range = Jymfony.Component.Validator.Constraints.Range;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;
const { expect } = require('chai');

describe('[Validator] Constraints.AllValidator', function () {
    it ('should not raise violation on null', async () => {
        await expect(null).to.be.validated.by(AllValidator)
            .with.constraint(new All({ constraints: [] }))
            .and.raise.no.violations();
    });

    it ('should not raise violation on undefined', async () => {
        await expect(undefined).to.be.validated.by(AllValidator)
            .with.constraint(new All({ constraints: [] }))
            .and.raise.no.violations();
    });

    it ('should throw if value is not iterable', async () => {
        await expect(42).to.be.validated.by(AllValidator)
            .with.constraint(new All({ constraints: [] }))
            .and.throw(UnexpectedValueException);
    });

    const validArguments = [
        [ 5, 6, 7 ],
        new Set([ 5, 6, 7 ]),
    ];

    let i = 0;
    for (const arg of validArguments) {
        it ('should walk single constraint #' + ++i, async () => {
            await expect(arg).to.be.validated.by(AllValidator)
                .with.constraint(new All({ constraints: [ new Range({ min: 4 }) ] }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const arg of validArguments) {
        it ('should walk mulitple constraint #' + ++i, async () => {
            await expect(arg).to.be.validated.by(AllValidator)
                .with.constraint(new All({ constraints: [ new Range({ min: 4 }), new NotNull() ] }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const arg of validArguments) {
        it ('should walk mulitple constraint and raise violations #' + ++i, async () => {
            const constraint1 = new Range({ max: 4, maxMessage: 'myMessage' });
            const constraint2 = new IsNull({ message: 'myMessage' });
            const argArr = [ ...arg ];

            await expect(arg).to.be.validated.by(AllValidator)
                .with.constraint(new All({ constraints: [ constraint1, constraint2 ] }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Range.TOO_HIGH_ERROR,
                    parameters: {
                        '{{ value }}': String(argArr[0]),
                        '{{ limit }}': '4',
                    },
                    propertyPath: '[0]',
                    invalidValue: argArr[0],
                    constraint: constraint1,
                }, {
                    message: 'myMessage',
                    code: IsNull.NOT_NULL_ERROR,
                    parameters: {
                        '{{ value }}': String(argArr[0]),
                    },
                    propertyPath: '[0]',
                    invalidValue: argArr[0],
                    constraint: constraint2,
                }, {
                    message: 'myMessage',
                    code: Range.TOO_HIGH_ERROR,
                    parameters: {
                        '{{ value }}': String(argArr[1]),
                        '{{ limit }}': '4',
                    },
                    propertyPath: '[1]',
                    invalidValue: argArr[1],
                    constraint: constraint1,
                }, {
                    message: 'myMessage',
                    code: IsNull.NOT_NULL_ERROR,
                    parameters: {
                        '{{ value }}': String(argArr[1]),
                    },
                    propertyPath: '[1]',
                    invalidValue: argArr[1],
                    constraint: constraint2,
                }, {
                    message: 'myMessage',
                    code: Range.TOO_HIGH_ERROR,
                    parameters: {
                        '{{ value }}': String(argArr[2]),
                        '{{ limit }}': '4',
                    },
                    propertyPath: '[2]',
                    invalidValue: argArr[2],
                    constraint: constraint1,
                }, {
                    message: 'myMessage',
                    code: IsNull.NOT_NULL_ERROR,
                    parameters: {
                        '{{ value }}': String(argArr[2]),
                    },
                    propertyPath: '[2]',
                    invalidValue: argArr[2],
                    constraint: constraint2,
                } ]);
        });
    }
});
