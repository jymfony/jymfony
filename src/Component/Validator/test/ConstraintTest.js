const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const Fixtures = Jymfony.Component.Validator.Fixtures;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;
const InvalidOptionsException = Jymfony.Component.Validator.Exception.InvalidOptionsException;
const MissingOptionsException = Jymfony.Component.Validator.Exception.MissingOptionsException;
const { expect } = require('chai');

describe('[Validator] Constraint', function () {
    it ('properties could be set', () => {
        const constraint = new Fixtures.ConstraintA({
            property1: 'foo',
            property2: 'bar',
        });

        expect(constraint.property1).to.be.equal('foo');
        expect(constraint.property2).to.be.equal('bar');
    });

    it ('throws trying to set non-existent property', () => {
        expect(() => new Fixtures.ConstraintA({ foo: 'bar' })).to.throw(InvalidOptionsException);
    });

    it ('throws trying to set non-existent property with required option', () => {
        expect(() => new Fixtures.ConstraintC({ option1: 'default', foo: 'bar' }))
            .to.throw(InvalidOptionsException);
    });

    it ('should set default property', () => {
        const constraint = new Fixtures.ConstraintA('foo');

        expect(constraint.property1).to.be.equal(undefined);
        expect(constraint.property2).to.be.equal('foo');
    });

    it ('should throw if no default property is set', () => {
        expect(() => new Fixtures.ConstraintB('foo')).to.throw(ConstraintDefinitionException);
    });

    it ('required options must be defined', () => {
        expect(() => new Fixtures.ConstraintC()).to.throw(MissingOptionsException);
    });

    it ('required option should pass', () => {
        const constraint = new Fixtures.ConstraintC({ option1: 'default' });
        expect(constraint.option1).to.be.equal('default');
    });

    it ('groups option is converted to array', () => {
        const constraint = new Fixtures.ConstraintA({ groups: 'Foo' });
        expect(constraint.groups).to.be.deep.equal([ 'Foo' ]);
    });

    it ('add implicit default group should add group', () => {
        const constraint = new Fixtures.ConstraintA({ groups: 'Default' });
        constraint.addImplicitGroupName('Foo');
        expect(constraint.groups).to.be.deep.equal([ 'Default', 'Foo' ]);
    });

    it ('should allow setting falsy value on default property value', () => {
        const constraint = new Fixtures.ConstraintA(0);
        expect(constraint.property2).to.be.equal(0);
    });

    it ('should allow creation with empty options', () => {
        const constraint = new Fixtures.ConstraintB({});
        expect(constraint.targets).to.be.deep.equal([ Constraint.PROPERTY_CONSTRAINT, Constraint.CLASS_CONSTRAINT ]);
    });

    it ('constraint should be serializable', () => {
        const constraint = new Fixtures.ConstraintA({
            property1: 'foo',
            property2: 'bar',
        });

        const restoredConstraint = __jymfony.unserialize(__jymfony.serialize(constraint));
        expect(restoredConstraint).to.be.deep.equal(constraint);
    });

    it('serialize should init groups to default', () => {
        let constraint = new Fixtures.ConstraintA({
            property1: 'foo',
            property2: 'bar',
        });

        constraint = __jymfony.unserialize(__jymfony.serialize(constraint));

        expect(constraint).to.be.deep.equal(new Fixtures.ConstraintA({
            property1: 'foo',
            property2: 'bar',
            groups: 'Default',
        }));
    });

    it('should retain custom groups on serialization', () => {
        let constraint = new Fixtures.ConstraintA({
            property1: 'foo',
            property2: 'bar',
            groups: 'MyGroup',
        });

        constraint = __jymfony.unserialize(__jymfony.serialize(constraint));

        expect(constraint.groups).to.be.deep.equal([ 'MyGroup' ]);
    });

    it ('should throw trying to get name for unknown code', () => {
        expect(() => Constraint.getErrorName(1)).to.throw(InvalidArgumentException);
    });

    it ('should throw on invalid options', () => {
        expect(() => new Fixtures.ConstraintA({ property2: 'foo', 0: 'bar', 5: 'baz' }))
            .to.throw(InvalidOptionsException, 'The options "0", "5" do not exist in constraint "Jymfony.Component.Validator.Fixtures.ConstraintA".');
    });

    it ('static properties should not count as options', () => {
        expect(() => new Fixtures.ConstraintWithStaticProperty({ foo: 'bar' })).to.throw(InvalidOptionsException);
    });
});
