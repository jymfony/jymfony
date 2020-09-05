const Valid = Jymfony.Component.Validator.Constraints.Valid;
const ValidatorBuilder = Jymfony.Component.Validator.ValidatorBuilder;
const ValidValidator = Jymfony.Component.Validator.Constraints.ValidValidator;

const Fixtures = Jymfony.Component.Validator.Fixtures.Valid;
const { expect } = require('chai');

describe('[Validator] Constraints.ValidValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(ValidValidator)
            .with.constraint(new Valid())
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(ValidValidator)
            .with.constraint(new Valid())
            .and.raise.no.violations();
    });

    it ('property paths should be passed to nested contexts', async () => {
        const validatorBuilder = new ValidatorBuilder();
        const validator = validatorBuilder.enableAnnotationMapping().getValidator();

        const foo = new Fixtures.Foo();
        const violations = await validator.validate(foo, null, [ 'nested' ]);

        expect(violations.length).to.be.equal(1);
        expect(violations.get(0).propertyPath).to.be.equal('fooBar.fooBarBaz.foo');
    });

});
