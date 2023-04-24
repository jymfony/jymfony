const Assert = Jymfony.Component.Testing.Framework.Assert;
const Collection = Jymfony.Component.Validator.Constraints.Collection;
const CollectionValidator = Jymfony.Component.Validator.Constraints.CollectionValidator;
const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const ConstraintValidatorInterface = Jymfony.Component.Validator.ConstraintValidatorInterface;
const ExecutionContext = Jymfony.Component.Validator.Context.ExecutionContext;
const Email = Jymfony.Component.Validator.Constraints.Email;
const NotNull = Jymfony.Component.Validator.Constraints.NotNull;
const Optional = Jymfony.Component.Validator.Constraints.Optional;
const Range = Jymfony.Component.Validator.Constraints.Range;
const Required = Jymfony.Component.Validator.Constraints.Required;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;
const Valid = Jymfony.Component.Validator.Constraints.Valid;
const { expect } = require('chai');

export default class CollectionValidatorTest extends TestCase {
    get testCaseName() {
        return '[Validator] ' + super.testCaseName;
    }

    testShouldRejectInvalidFieldsOptions() {
        this.expectException(ConstraintDefinitionException);
        new Collection({ fields: 'foo' });
    }

    testShouldRejectInvalidOptions() {
        this.expectException(ConstraintDefinitionException);
        this.expectExceptionMessage('The value "bar" is not an instance of Constraint in constraint "Jymfony.Component.Validator.Constraints.Required".');
        new Collection({ foo: 'bar' });
    }

    testShouldRejectValidConstraint() {
        this.expectException(ConstraintDefinitionException);
        this.expectExceptionMessage('The constraint Valid cannot be nested inside constraint "Jymfony.Component.Validator.Constraints.Required". You can only declare the Valid constraint directly on a field or method.');
        new Collection({ foo: new Valid() });
    }

    testShouldRejectValidConstraintWithinOptional() {
        this.expectException(ConstraintDefinitionException);
        this.expectExceptionMessage('The constraint Valid cannot be nested inside constraint "Jymfony.Component.Validator.Constraints.Optional". You can only declare the Valid constraint directly on a field or method.');
        new Collection({ foo: new Optional(new Valid()) });
    }

    testShouldRejectValidConstraintWithinRequired() {
        this.expectException(ConstraintDefinitionException);
        this.expectExceptionMessage('The constraint Valid cannot be nested inside constraint "Jymfony.Component.Validator.Constraints.Required". You can only declare the Valid constraint directly on a field or method.');
        new Collection({ foo: new Required(new Valid()) });
    }

    testShouldAcceptOptionalConstraintAsOneElement() {
        const constraint1 = new Collection({
            fields: {
                alternate_email: [
                    new Optional(new Email()),
                ],
            },
        });

        const constraint2 = new Collection({
            fields: {
                alternate_email: new Optional(new Email()),
            },
        });

        __self.assertEquals(constraint2, constraint1);
    }

    testShouldAcceptRequiredConstraintAsOneElement() {
        const constraint1 = new Collection({
            fields: {
                alternate_email: [
                    new Required(new Email()),
                ],
            },
        });

        const constraint2 = new Collection({
            fields: {
                alternate_email: new Required(new Email()),
            },
        });

        __self.assertEquals(constraint2, constraint1);
    }

    async testShouldNotRaiseAnyViolationOnNullValue() {
        await expect(null).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({ fields: {
                foo: [ new Range({ min: 5 }) ],
            } })).and.raise.no.violations();
    }

    async testShouldNotRaiseAnyViolationOnUndefined() {
        await expect(undefined).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({ fields: {
                foo: [ new Range({ min: 5 }) ],
            } })).and.raise.no.violations();
    }

    async testShouldUseFieldsAsDefaultOption() {
        let initializeCalled = 0;
        const inner = this.prophesize(Constraint);

        const innerValidator = class extends implementationOf(ConstraintValidatorInterface) {
            initialize(context) {
                Assert.assertInstanceOf(ExecutionContext, context);
                Assert.assertEquals('foo', context.getPropertyPath());

                ++initializeCalled;
            }

            validate(value, constraint) {
                Assert.assertEquals('foobar', value);
                Assert.assertEquals(inner.reveal(), constraint);
            }
        };

        inner.validatedBy().willReturn(innerValidator);
        inner.groups().willReturn([ 'Default' ]);

        await expect({foo: 'foobar'}).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({ foo: inner.reveal() }))
            .and.raise.no.violations();

        __self.assertEquals(1, initializeCalled, 'initialized not called');
    }

    async testShouldThrowIfValueIsNotASimpleObject() {
        await expect('foobar').to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({ foo: new Range({ min: 4 }) }))
            .and.throw(UnexpectedValueException);
    }

    async testShouldValidateASingleInnerConstraint() {
        const inner = this.prophesize(Constraint);

        const validateCalls = [];
        const innerValidator = class extends implementationOf(ConstraintValidatorInterface) {
            initialize() { }
            validate(...$args) {
                validateCalls.push($args);
            }
        };

        inner.validatedBy().willReturn(innerValidator);
        inner.groups().willReturn([ 'Default' ]);

        const obj = { foo: 3, bar: 5 };

        await expect(obj).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({ foo: inner.reveal(), bar: inner.reveal() }))
            .and.raise.no.violations();

        __self.assertEquals([
            [ 3, inner.reveal() ],
            [ 5, inner.reveal() ],
        ], validateCalls);
    }

    async testShouldWalkMultipleConstraints() {
        const inner1 = this.prophesize(Constraint);
        const inner2 = this.prophesize(Constraint);

        const validate1Calls = [];
        const validate2Calls = [];

        const inner1Validator = class extends implementationOf(ConstraintValidatorInterface) {
            initialize() { }
            validate(...$args) {
                validate1Calls.push($args);
            }
        };

        const inner2Validator = class extends implementationOf(ConstraintValidatorInterface) {
            initialize() { }
            validate(...$args) {
                validate2Calls.push($args);
            }
        };

        inner1.validatedBy().willReturn(inner1Validator);
        inner1.groups().willReturn([ 'Default' ]);
        inner2.validatedBy().willReturn(inner2Validator);
        inner2.groups().willReturn([ 'Default' ]);

        const obj = { foo: 3, bar: 5 };

        await expect(obj).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({
                foo: [
                    inner1.reveal(),
                    inner2.reveal(),
                ],
                bar: [
                    inner1.reveal(),
                    inner2.reveal(),
                ],
            })).and.raise.no.violations();

        __self.assertEquals([
            [ 3, inner1.reveal() ],
            [ 5, inner1.reveal() ],
        ], validate1Calls);

        __self.assertEquals([
            [ 3, inner2.reveal() ],
            [ 5, inner2.reveal() ],
        ], validate2Calls);
    }

    async testShouldRaiseViolationsOnExtraFields() {
        const obj = { foo: 3, bar: 5 };

        await expect(obj).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({
                fields: { foo: new NotNull() },
                extraFieldsMessage: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                code: Collection.NO_SUCH_FIELD_ERROR,
                parameters: {
                    '{{ field }}': '"bar"',
                },
                propertyPath: 'bar',
                invalidValue: 5,
            } ]);
    }

    async testShouldNotRaiseViolationsIfExtraFieldsAreAllowed() {
        const obj = { foo: 3, bar: 5 };

        await expect(obj).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({
                fields: { foo: new NotNull() },
                allowExtraFields: true,
            })).and.raise.no.violations();
    }

    async testShouldRaiseViolationsIfRequiredFieldIsMissing() {
        await expect({}).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({
                fields: { foo: new NotNull() },
                missingFieldsMessage: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                code: Collection.MISSING_FIELD_ERROR,
                parameters: {
                    '{{ field }}': '"foo"',
                },
                propertyPath: 'foo',
                invalidValue: undefined,
            } ]);
    }

    async testShouldNotRaiseViolationsIfMissingFieldsAreAllowed() {
        await expect({}).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({
                fields: { foo: new NotNull() },
                allowMissingFields: true,
            })).and.raise.no.violations();
    }

    async testShouldWorkWithOptionalField() {
        await expect({ foo: undefined }).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({
                fields: { foo: new Optional() },
                allowMissingFields: true,
            })).and.raise.no.violations();

        await expect({}).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({
                fields: { foo: new Optional() },
                allowMissingFields: true,
            })).and.raise.no.violations();
    }
}
