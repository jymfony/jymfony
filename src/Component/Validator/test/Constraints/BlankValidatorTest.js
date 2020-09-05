const Blank = Jymfony.Component.Validator.Constraints.Blank;
const BlankValidator = Jymfony.Component.Validator.Constraints.BlankValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.BlankValidator', function () {
    const invalidValues = [
        [ false, 'false' ],
        [ 0, '0' ],
        [ 0.0, '0' ],
        [ 'test', '"test"' ],
        [ [], 'array' ],
        [ {}, 'object' ],
    ];

    let index = 0;
    for (const [ invalid, asString ] of invalidValues) {
        it('should raise violation #' + ++index, async () => {
            await expect(invalid).to.be.validated.by(BlankValidator)
                .with.constraint(new Blank({message: 'myMessage'}))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Blank.NOT_BLANK_ERROR,
                    parameters: {
                        '{{ value }}': asString,
                    },
                    propertyPath: '',
                } ]);
        });
    }

    it ('should not raise violation on empty string', async () => {
        await expect('').to.be.validated.by(BlankValidator)
            .with.constraint(new Blank({ message: 'myMessage' }))
            .and.raise.no.violations();
    });

    it ('should not raise violation on null', async () => {
        await expect(null).to.be.validated.by(BlankValidator)
            .with.constraint(new Blank({ message: 'myMessage' }))
            .and.raise.no.violations();
    });

    it ('should not raise violation on undefined', async () => {
        await expect(undefined).to.be.validated.by(BlankValidator)
            .with.constraint(new Blank({ message: 'myMessage' }))
            .and.raise.no.violations();
    });
});
