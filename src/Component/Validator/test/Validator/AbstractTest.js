import { AbstractValidatorTest } from './AbstractValidatorTest';

const Callback = Jymfony.Component.Validator.Constraints.Callback;
const Collection = Jymfony.Component.Validator.Constraints.Collection;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const Entity = Jymfony.Component.Validator.Fixtures.Entity;
const EqualTo = Jymfony.Component.Validator.Constraints.EqualTo;
const FailingConstraint = Jymfony.Component.Validator.Fixtures.FailingConstraint;
const GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;
const NotBlank = Jymfony.Component.Validator.Constraints.NotBlank;
const NotNull = Jymfony.Component.Validator.Constraints.NotNull;
const Traverse = Jymfony.Component.Validator.Constraints.Traverse;
const Valid = Jymfony.Component.Validator.Constraints.Valid;
const Reference = Jymfony.Component.Validator.Fixtures.Reference;
const { expect } = require('chai');

export class AbstractTest extends AbstractValidatorTest {
    __construct() {
        this.validator = undefined;

        super.__construct();
    }

    /**
     *
     * @param {Jymfony.Contracts.Metadata.MetadataFactoryInterface} metadataFactory
     *
     * @returns {Jymfony.Component.Validator.Validator.ValidatorInterface}
     *
     * @protected
     * @abstract
     */
    createValidator(metadataFactory) { } // eslint-disable-line no-unused-vars

    beforeEach() {
        super.beforeEach();
        this.validator = this.createValidator(this._metadataFactory);
    }

    validate(value, constraints = null, groups = null) {
        return this.validator.validate(value, constraints, groups);
    }

    validateProperty(object, propertyName, groups = null) {
        return this.validator.validateProperty(object, propertyName, groups);
    }

    validatePropertyValue(object, propertyName, value, groups = null) {
        return this.validator.validatePropertyValue(object, propertyName, value, groups);
    }

    async testValidateConstraintWithoutGroup() {
        const violations = await this.validator.validate(null, new NotNull());
        expect(violations).to.have.length(1);
    }

    async testValidateWithEmptyArrayAsConstraint() {
        const violations = await this.validator.validate('value', []);
        expect(violations).to.have.length(0);
    }

    async testGroupSequenceAbortsAfterFailedGroup() {
        const entity = new Entity();

        const callback1 = (value, context) => context.addViolation('Message 1');
        const callback2 = (value, context) => context.addViolation('Message 2');

        this._metadata.addConstraint(new Callback({ callback: () => {}, groups: 'Group 1' }));
        this._metadata.addConstraint(new Callback({ callback: callback1, groups: 'Group 2' }));
        this._metadata.addConstraint(new Callback({ callback: callback2, groups: 'Group 3' }));

        const sequence = new GroupSequence([ 'Group 1', 'Group 2', 'Group 3' ]);
        const violations = await this.validator.validate(entity, new Valid(), sequence);

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message 1');
    }

    async testGroupSequenceIncludesReferences() {
        const entity = new Entity();
        entity.reference = new Reference();

        const callback1 = (value, context) => context.addViolation('Reference violation 1');
        const callback2 = (value, context) => context.addViolation('Reference violation 2');

        this._metadata.addFieldConstraint('reference', new Valid());
        this._referenceMetadata.addConstraint(new Callback({ callback: callback1, groups: 'Group 1' }));
        this._referenceMetadata.addConstraint(new Callback({ callback: callback2, groups: 'Group 2' }));

        const sequence = new GroupSequence([ 'Group 1', 'Entity' ]);
        const violations = await this.validator.validate(entity, new Valid(), sequence);

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Reference violation 1');
    }

    async testValidateInSeparateContext() {
        const entity = new Entity();
        entity.reference = new Reference();

        const callback1 = async (value, context) => {
            const violations = await context
                .validator
                // Since the validator is not context aware, the group must be passed explicitly
                .validate(value.reference, new Valid(), 'Group')
            ;

            expect(violations).to.have.length(1);
            expect(violations.get(0).message).to.be.equal('Message value');
            expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
            expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
            expect(violations.get(0).propertyPath).to.be.deep.equal('');

            // The root is different as we're in a new context
            expect(violations.get(0).root).to.be.equal(entity.reference);
            expect(violations.get(0).invalidValue).to.be.equal(entity.reference);
            expect(violations.get(0).plural).to.be.null;
            expect(violations.get(0).code).to.be.null;

            // Verify that this method is called
            context.addViolation('Separate violation');
        };

        const callback2 = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Reference));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._referenceMetadata);
            expect(context.root).to.be.equal(entity.reference);
            expect(context.value).to.be.equal(entity.reference);
            expect(value).to.be.equal(entity.reference);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addConstraint(new Callback({ callback: callback1, groups: 'Group' }));
        this._referenceMetadata.addConstraint(new Callback({ callback: callback2, groups: 'Group' }));

        const violations = await this.validator.validate(entity, new Valid(), 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Separate violation');
    }

    async testValidateInContext() {
        const entity = new Entity();
        entity.reference = new Reference();

        const callback1 = async (value, context) => {
            const previousValue = context.value;
            const previousObject = context.object;
            const previousMetadata = context.metadata;
            const previousPath = context.getPropertyPath();
            const previousGroup = context.group;

            await context
                .validator
                .inContext(context)
                .atPath('subpath')
                .validate(value.reference)
            ;

            // Context changes shouldn't leak out of the validate() call
            expect(context.value).to.be.equal(previousValue);
            expect(context.object).to.be.equal(previousObject);
            expect(context.metadata).to.be.equal(previousMetadata);
            expect(context.getPropertyPath()).to.be.equal(previousPath);
            expect(context.group).to.be.equal(previousGroup);
        };

        const callback2 = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Reference));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('subpath');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._referenceMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal(entity.reference);
            expect(value).to.be.equal(entity.reference);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addConstraint(new Callback({ callback: callback1, groups: 'Group' }));
        this._referenceMetadata.addConstraint(new Callback({ callback: callback2, groups: 'Group' }));

        const violations = await this.validator.validate(entity, new Valid(), 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('subpath');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal(entity.reference);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testValidateArrayInContext() {
        const entity = new Entity();
        entity.reference = new Reference();

        const callback1 = async (value, context) => {
            const previousValue = context.value;
            const previousObject = context.object;
            const previousMetadata = context.metadata;
            const previousPath = context.getPropertyPath();
            const previousGroup = context.group;

            await context
                .validator
                .inContext(context)
                .atPath('subpath')
                .validate({ key: value.reference })
            ;

            // Context changes shouldn't leak out of the validate() call
            expect(context.value).to.be.equal(previousValue);
            expect(context.object).to.be.equal(previousObject);
            expect(context.metadata).to.be.equal(previousMetadata);
            expect(context.getPropertyPath()).to.be.equal(previousPath);
            expect(context.group).to.be.equal(previousGroup);
        };

        const callback2 = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Reference));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('subpath[key]');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._referenceMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal(entity.reference);
            expect(value).to.be.equal(entity.reference);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addConstraint(new Callback({ callback: callback1, groups: 'Group' }));
        this._referenceMetadata.addConstraint(new Callback({ callback: callback2, groups: 'Group' }));

        const violations = await this.validator.validate(entity, new Valid(), 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('subpath[key]');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal(entity.reference);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testExpectTraversableIfTraversalEnabledOnClass() {
        const entity = new Entity();
        this._metadata.addConstraint(new Traverse(true));

        try {
            await this.validator.validate(entity);
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(ConstraintDefinitionException);
        }
    }

    async testReferenceCascadeDisabledByDefault() {
        const entity = new Entity();
        entity.reference = new Reference();

        const callback = () => {
            throw new Error('Should not be called');
        };

        this._referenceMetadata.addConstraint(new Callback({ callback, groups: 'Group' }));

        const violations = await this.validate(entity, new Valid(), 'Group');
        expect(violations).to.have.length(0);
    }

    async testAddCustomizedViolation() {
        const entity = new Entity();

        const callback = (value, context) => {
            context.buildViolation('Message %param%')
                .setParameter('%param%', 'value')
                .setInvalidValue('Invalid value')
                .setPlural(2)
                .setCode('42')
                .addViolation();
        };

        this._metadata.addConstraint(new Callback(callback));

        const violations = await this.validator.validate(entity);

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal('Invalid value');
        expect(violations.get(0).plural).to.be.equal(2);
        expect(violations.get(0).code).to.be.equal('42');
    }

    async testNoDuplicateValidationIfClassConstraintInMultipleGroups() {
        const entity = new Entity();
        const callback = (value, context) => context.addViolation('Message');

        this._metadata.addConstraint(new Callback({ callback, groups: [ 'Group 1', 'Group 2' ] }));

        const violations = await this.validator.validate(entity, new Valid(), [ 'Group 1', 'Group 2' ]);
        expect(violations).to.have.length(1);
    }

    async testNoDuplicateValidationIfPropertyConstraintInMultipleGroups() {
        const entity = new Entity();

        const callback = (value, context) => context.addViolation('Message');

        this._metadata.addFieldConstraint('firstName', new Callback({ callback, groups: [ 'Group 1', 'Group 2' ] }));

        const violations = await this.validator.validate(entity, new Valid(), [ 'Group 1', 'Group 2' ]);
        expect(violations).to.have.length(1);
    }

    async testValidateFailsIfNoConstraintsAndNoObjectOrArray() {
        try {
            await this.validate('Foobar');
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(RuntimeException);
        }
    }

    async testAccessCurrentObject() {
        let called = false;
        const entity = new Entity();
        entity.firstName = 'Alessandro';
        entity.data = { firstName: 'Alessandro' };

        const callback = (value, context) => {
            called = true;
            expect(context.object).to.be.equal(entity);
        };

        this._metadata.addConstraint(new Callback(callback));
        this._metadata.addFieldConstraint('firstName', new Callback(callback));
        this._metadata.addFieldConstraint('data', new Collection({ firstName: new EqualTo('Alessandro') }));

        await this.validator.validate(entity);
        expect(called).to.be.true;
    }

    async testPassConstraintToViolation() {
        const constraint = new FailingConstraint();
        const violations = await this.validate('Foobar', constraint);

        expect(violations).to.have.length(1);
        expect(violations.get(0).constraint).to.be.equal(constraint);
    }

    async testCollectionConstraitViolationHasCorrectContext() {
        const data = { foo: 'fooValue' };

        // Missing field must not be the first in the collection validation
        const constraint = new Collection({
            foo: new NotNull(),
            bar: new NotNull(),
        });

        const violations = await this.validate(data, constraint);

        expect(violations).to.have.length(1);
        expect(violations.get(0).constraint).to.be.equal(constraint);
    }

    async testNestedObjectIsNotValidatedIfGroupInValidConstraintIsNotValidated() {
        const entity = new Entity();
        entity.firstName = '';
        const reference = new Reference();
        reference.value = '';
        entity.childA = reference;

        this._metadata.addFieldConstraint('firstName', new NotBlank({ groups: 'group1' }));
        this._metadata.addFieldConstraint('childA', new Valid({ groups: 'group1' }));
        this._referenceMetadata.addFieldConstraint('value', new NotBlank());

        const violations = await this.validator.validate(entity, null, []);
        expect(violations).to.have.length(0);
    }

    async testNestedObjectIsValidatedIfGroupInValidConstraintIsValidated() {
        const entity = new Entity();
        entity.firstName = '';
        const reference = new Reference();
        reference.value = '';
        entity.childA = reference;

        this._metadata.addFieldConstraint('firstName', new NotBlank({ groups: 'group1' }));
        this._metadata.addFieldConstraint('childA', new Valid({ groups: 'group1' }));
        this._referenceMetadata.addFieldConstraint('value', new NotBlank({ groups: 'group1' }));

        const violations = await this.validator.validate(entity, null, [ 'Default', 'group1' ]);
        expect(violations).to.have.length(2);
    }

    async testNestedObjectIsValidatedInMultipleGroupsIfGroupInValidConstraintIsValidated() {
        const entity = new Entity();
        entity.firstName = null;

        const reference = new Reference();
        reference.value = null;

        entity.childA = reference;

        this._metadata.addFieldConstraint('firstName', new NotBlank());
        this._metadata.addFieldConstraint('childA', new Valid({ groups: [ 'group1', 'group2' ] }));

        this._referenceMetadata.addFieldConstraint('value', new NotBlank({ groups: 'group1' }));
        this._referenceMetadata.addFieldConstraint('value', new NotNull({ groups: 'group2' }));

        const violations = await this.validator.validate(entity, null, [ 'Default', 'group1', 'group2' ]);
        expect(violations).to.have.length(3);
    }
};
