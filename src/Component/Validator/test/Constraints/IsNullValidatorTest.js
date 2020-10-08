const IsNull = Jymfony.Component.Validator.Constraints.IsNull;
const IsNullValidator = Jymfony.Component.Validator.Constraints.IsNullValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.IsNullValidator', function () {
    const invalidValues = [
        [ '', '""' ],
        [ true, 'true' ],
        [ false, 'false' ],
        [ 0, '0' ],
        [ 0.0, '0' ],
        [ 'test', '"test"' ],
        [ [], 'array' ],
        [ {}, 'object' ],
    ];

    let index = 0;
    for (const [ value, asText ] of invalidValues) {
        it('should not raise violation #' + ++index, async () => {
            await expect(value).to.be.validated.by(IsNullValidator)
                .with.constraint(new IsNull({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: IsNull.NOT_NULL_ERROR,
                    parameters: {
                        '{{ value }}': asText,
                    },
                    propertyPath: '',
                } ]);
        });
    }

    it ('should raise violation on null', async () => {
        await expect(null).to.be.validated.by(IsNullValidator)
            .with.constraint(new IsNull({ message: 'myMessage' }))
            .and.raise.no.violations();
    });

    it ('should raise violation on undefined', async () => {
        await expect(undefined).to.be.validated.by(IsNullValidator)
            .with.constraint(new IsNull({ message: 'myMessage' }))
            .and.raise.no.violations();
    });
});
