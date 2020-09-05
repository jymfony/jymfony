const Constraints = Jymfony.Component.Validator.Constraints;
const { expect } = require('chai');

describe('[Validator] Constraints.SequentiallyValidator', function () {
    it('should walk through constraints', async () => {
        const constraints = [
            new Constraints.Type('number'),
            new Constraints.Range({ min: 4 }),
        ];

        await expect(6).to.be.validated.by(Constraints.SequentiallyValidator)
            .with.constraint(new Constraints.Sequentially(constraints))
            .and.raise.no.violations();
    });

    it('should stop at first violation', async () => {
        const regexConstraint = new Constraints.Regex({ pattern: /^[a-z]$/ });
        const constraints = [
            new Constraints.Type('string'),
            regexConstraint,
            new Constraints.NotEqualTo('Foo'),
        ];

        await expect('Foo').to.be.validated.by(Constraints.SequentiallyValidator)
            .with.constraint(new Constraints.Sequentially(constraints))
            .and.raise.violations([ {
                message: 'This value is not valid.',
                code: 'de1e3db3-5ed4-4941-aae4-59f3667cc3a3',
                parameters: {
                    '{{ value }}': '"Foo"',
                },
                constraint: regexConstraint,
                invalidValue: 'Foo',
                propertyPath: '',
            } ]);
    });
});
