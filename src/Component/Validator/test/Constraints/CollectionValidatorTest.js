const Collection = Jymfony.Component.Validator.Constraints.Collection;
const CollectionValidator = Jymfony.Component.Validator.Constraints.CollectionValidator;
const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const ConstraintValidatorInterface = Jymfony.Component.Validator.ConstraintValidatorInterface;
const ExecutionContext = Jymfony.Component.Validator.Context.ExecutionContext;
const Email = Jymfony.Component.Validator.Constraints.Email;
const NotNull = Jymfony.Component.Validator.Constraints.NotNull;
const Optional = Jymfony.Component.Validator.Constraints.Optional;
const Prophet = Jymfony.Component.Testing.Prophet;
const Range = Jymfony.Component.Validator.Constraints.Range;
const Required = Jymfony.Component.Validator.Constraints.Required;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;
const Valid = Jymfony.Component.Validator.Constraints.Valid;
const { expect } = require('chai');

describe('[Validator] Constraints.CollectionValidator', function () {
    /**
     * @type {Jymfony.Component.Testing.Prophet}
     */
    let prophet;

    beforeEach(() => {
        prophet = new Prophet();
    });

    afterEach(() => {
        if ('failed' === this.ctx.currentTest.state) {
            return;
        }

        prophet.checkPredictions();
    });

    it ('should reject invalid fields options', async () => {
        await expect(() => new Collection({ fields: 'foo' }))
            .to.throw(ConstraintDefinitionException);
    });

    it ('should reject invalid options', async () => {
        await expect(() => new Collection({ foo: 'bar' }))
            .to.throw(ConstraintDefinitionException);
    });

    it ('should reject valid constraints', async () => {
        await expect(() => new Collection({ foo: new Valid() }))
            .to.throw(ConstraintDefinitionException);
    });

    it ('should reject valid constraint within optional', async () => {
        await expect(() => new Collection({ foo: new Optional(new Valid()) }))
            .to.throw(ConstraintDefinitionException);
    });

    it ('should reject valid constraint within required', async () => {
        await expect(() => new Collection({ foo: new Required(new Valid()) }))
            .to.throw(ConstraintDefinitionException);
    });

    it ('should accept optional constraint as one element', async () => {
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

        await expect(constraint1).to.dump.as(constraint2);
    });

    it ('should accept required constraint as one element', async () => {
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

        await expect(constraint1).to.dump.as(constraint2);
    });

    it ('should not raise any violation on null value', async () => {
        await expect(null).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({ fields: {
                foo: [ new Range({ min: 5 }) ],
            } })).and.raise.no.violations();
    });

    it ('should not raise any violation on undefined', async () => {
        await expect(undefined).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({ fields: {
                foo: [ new Range({ min: 5 }) ],
            } })).and.raise.no.violations();
    });

    it ('should use fields as default option', async () => {
        let initializeCalled = 0;
        const inner = prophet.prophesize(Constraint);

        const innerValidator = class extends implementationOf(ConstraintValidatorInterface) {
            initialize(context) {
                expect(context).to.be.instanceOf(ExecutionContext);
                expect(context.getPropertyPath()).to.be.equal('foo');

                ++initializeCalled;
            }

            validate(value, constraint) {
                expect(value).to.be.equal('foobar');
                expect(constraint).to.be.equal(inner.reveal());
            }
        };

        inner.validatedBy().willReturn(innerValidator);
        inner.groups().willReturn([ 'Default' ]);

        await expect({foo: 'foobar'}).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({ foo: inner.reveal() }))
            .and.raise.no.violations();

        expect(initializeCalled).to.be.equal(1, 'initialized not called');
    });

    it ('should throw if value is not a simple object', async () => {
        await expect('foobar').to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({ foo: new Range({ min: 4 }) }))
            .and.throw(UnexpectedValueException);
    });

    it ('should validate a single inner constraint', async () => {
        const inner = prophet.prophesize(Constraint);

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

        expect(validateCalls).to.be.deep.equal([
            [ 3, inner.reveal() ],
            [ 5, inner.reveal() ],
        ]);
    });

    it ('should walk multiple constraints', async () => {
        const inner1 = prophet.prophesize(Constraint);
        const inner2 = prophet.prophesize(Constraint);

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

        expect(validate1Calls).to.be.deep.equal([
            [ 3, inner1.reveal() ],
            [ 5, inner1.reveal() ],
        ]);

        expect(validate2Calls).to.be.deep.equal([
            [ 3, inner2.reveal() ],
            [ 5, inner2.reveal() ],
        ]);
    });

    it ('should raise violations on extra fields', async () => {
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
    });

    it ('should not raise violations if extra fields are allowed', async () => {
        const obj = { foo: 3, bar: 5 };

        await expect(obj).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({
                fields: { foo: new NotNull() },
                allowExtraFields: true,
            })).and.raise.no.violations();
    });

    it ('should raise violations if required field is missing', async () => {
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
    });

    it ('should not raise violations if missing fields are allowed', async () => {
        await expect({}).to.be.validated.by(CollectionValidator)
            .with.constraint(new Collection({
                fields: { foo: new NotNull() },
                allowMissingFields: true,
            })).and.raise.no.violations();
    });

    it ('should work with optional field', async () => {
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
    });
});
