const Blank = Jymfony.Component.Validator.Constraints.Blank;
const Container = Jymfony.Component.DependencyInjection.Container;
const Constraint = Jymfony.Component.Validator.Constraint;
const ContainerConstraintValidatorFactory = Jymfony.Component.Validator.ContainerConstraintValidatorFactory;
const Fixtures = Jymfony.Component.Validator.Fixtures;
const ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;
const { expect } = require('chai');

describe('[Validator] ContainerConstraintValidatorFactory', function () {
    it ('getInstance should create validator', () => {
        const factory = new ContainerConstraintValidatorFactory(new Container());
        expect(factory.getInstance(new Fixtures.DummyConstraint())).to.be.instanceOf(Fixtures.DummyConstraintValidator);
    });

    it ('getInstance should return existing validator', () => {
        const factory = new ContainerConstraintValidatorFactory(new Container());
        const v1 = factory.getInstance(new Blank());
        const v2 = factory.getInstance(new Blank());

        expect(v1).to.be.equal(v2);
    });

    it ('getInstance should return service', () => {
        const validator = new Fixtures.DummyConstraintValidator();
        const container = new Container();
        container.set(Fixtures.DummyConstraintValidator, validator);

        const factory = new ContainerConstraintValidatorFactory(container);

        expect(factory.getInstance(new Fixtures.DummyConstraint())).to.be.equal(validator);
    });

    it ('getInstance should throw on invalid validator class', () => {
        const constraint = new class extends Constraint {
            get validatedBy() {
                return 'Fully.Qualified.ConstraintValidator.Class.Name';
            }
        }();

        const factory = new ContainerConstraintValidatorFactory(new Container());
        expect(() => factory.getInstance(constraint)).to.throw(ValidatorException);
    });
});
