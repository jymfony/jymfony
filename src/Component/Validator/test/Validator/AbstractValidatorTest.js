import { expect } from 'chai';

const Callback = Jymfony.Component.Validator.Constraints.Callback;
const ClassMetadata = Jymfony.Component.Validator.Mapping.ClassMetadata;
const FakeMetadataFactory = Jymfony.Component.Validator.Fixtures.FakeMetadataFactory;
const GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;
const GroupSequenceProviderEntity = Jymfony.Component.Validator.Fixtures.GroupSequenceProviderEntity;
const RuntimeException = Jymfony.Component.Validator.Exception.RuntimeException;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Valid = Jymfony.Component.Validator.Constraints.Valid;

const Entity = Jymfony.Component.Validator.Fixtures.Entity;
const Reference = Jymfony.Component.Validator.Fixtures.Reference;
const LazyProperty = Jymfony.Component.Validator.Validator.LazyProperty;

export class AbstractValidatorTest extends TestCase {
    get testCaseName() {
        return '[Validator] Validator.' + super.testCaseName;
    }

    __construct() {
        this._metadataFactory = undefined;
        this._metadata = undefined;
        this._referenceMetadata = undefined;

        super.__construct();
    }

    beforeEach() {
        if (! __jymfony.Platform.hasPrivateFieldSupport()) {
            this.markTestSkipped();
        }

        this._metadataFactory = new FakeMetadataFactory();
        this._metadata = new ClassMetadata(new ReflectionClass(Entity));
        this._referenceMetadata = new ClassMetadata(new ReflectionClass(Reference));
        this._metadataFactory.addMetadata(this._metadata);
        this._metadataFactory.addMetadata(this._referenceMetadata);
        this._metadataFactory.addMetadata(new ClassMetadata(LazyProperty));
    }

    /**
     * Validates value.
     *
     * @param {*} value
     * @param {Jymfony.Component.Validator.Constraint[] | null} constraints
     * @param {string | string[] | null} groups
     *
     * @returns {Promise<Jymfony.Component.Validator.ConstraintViolationList>}
     *
     * @abstract
     */
    async validate(value, constraints = null, groups = null) { // eslint-disable-line no-unused-vars
        throw new Error('validate must be implemented');
    }

    /**
     * Validates object property.
     *
     * @param {*} object
     * @param {string} propertyName
     * @param {string | string[] | null} groups
     *
     * @returns {Promise<Jymfony.Component.Validator.ConstraintViolationList>}
     *
     * @abstract
     */
    async validateProperty(object, propertyName, groups = null) { // eslint-disable-line no-unused-vars
        throw new Error('validateProperty must be implemented');
    }

    /**
     * Validates object property with provided value.
     *
     * @param {*} object
     * @param {string} propertyName
     * @param {*} value
     * @param {string | string[] | null} groups
     *
     * @returns {Promise<Jymfony.Component.Validator.ConstraintViolationList>}
     *
     * @abstract
     */
    async validatePropertyValue(object, propertyName, value, groups = null) { // eslint-disable-line no-unused-vars
        throw new Error('validatePropertyValue must be implemented');
    }

    async testValidate() {
        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className);
            expect(context.propertyName);
            expect(context.getPropertyPath()).to.be.equal('');
            expect(context.group).to.be.equal('Group');
            expect(context.root).to.be.equal('Alessandro');
            expect(context.value).to.be.equal('Alessandro');
            expect(value).to.be.equal('Alessandro');

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        const constraint = new Callback({
            callback,
            groups: 'Group',
        });

        const violations = await this.validate('Alessandro', constraint, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('');
        expect(violations.get(0).root).to.be.equal('Alessandro');
        expect(violations.get(0).invalidValue).to.be.equal('Alessandro');
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testClassConstraint() {
        const entity = new Entity();

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._metadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal(entity);
            expect(value).to.be.equal(entity);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(entity, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal(entity);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testPropertyConstraint() {
        const entity = new Entity();
        entity.firstName = 'Alessandro';

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            const propertyMetadata = this._metadata.getAttributeMetadata('firstName');

            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.equal('firstName');
            expect(context.getPropertyPath()).to.be.equal('firstName');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(propertyMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal('Alessandro');
            expect(value).to.be.equal('Alessandro');

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addFieldConstraint('firstName', new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(entity, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('firstName');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal('Alessandro');
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testGetterConstraint() {
        const entity = new Entity();
        entity.setLastName('Chitolina');

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            const propertyMetadata = this._metadata.getAttributeMetadata('lastName');

            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.equal('lastName');
            expect(context.getPropertyPath()).to.be.equal('lastName');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(propertyMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal('Chitolina');
            expect(value).to.be.equal('Chitolina');

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addGetterConstraint('lastName', new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(entity, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('lastName');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal('Chitolina');
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testMap() {
        const entity = new Entity();
        const obj = new Map();
        obj.set('key', entity);

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('[key]');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._metadata);
            expect(context.root).to.be.equal(obj);
            expect(context.value).to.be.equal(entity);
            expect(value).to.be.equal(entity);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(obj, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('[key]');
        expect(violations.get(0).root).to.be.equal(obj);
        expect(violations.get(0).invalidValue).to.be.equal(entity);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testHashmap() {
        const entity = new Entity();
        const obj = { key: entity };

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('[key]');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._metadata);
            expect(context.root).to.be.equal(obj);
            expect(context.value).to.be.equal(entity);
            expect(value).to.be.equal(entity);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(obj, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('[key]');
        expect(violations.get(0).root).to.be.equal(obj);
        expect(violations.get(0).invalidValue).to.be.equal(entity);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testSet() {
        const entity = new Entity();
        const arr = new Set([ entity ]);

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('[0]');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._metadata);
            expect(context.root).to.be.equal(arr);
            expect(context.value).to.be.equal(entity);
            expect(value).to.be.equal(entity);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(arr, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('[0]');
        expect(violations.get(0).root).to.be.equal(arr);
        expect(violations.get(0).invalidValue).to.be.equal(entity);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testArray() {
        const entity = new Entity();
        const arr = [ entity ];

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('[0]');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._metadata);
            expect(context.root).to.be.equal(arr);
            expect(context.value).to.be.equal(entity);
            expect(value).to.be.equal(entity);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(arr, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('[0]');
        expect(violations.get(0).root).to.be.equal(arr);
        expect(violations.get(0).invalidValue).to.be.equal(entity);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testRecursion() {
        const entity = new Entity();
        const arr = [ null, null, { key: entity } ];

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('[2][key]');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._metadata);
            expect(context.root).to.be.equal(arr);
            expect(context.value).to.be.equal(entity);
            expect(value).to.be.equal(entity);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(arr, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('[2][key]');
        expect(violations.get(0).root).to.be.equal(arr);
        expect(violations.get(0).invalidValue).to.be.equal(entity);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testReferenceClassConstraint() {
        const entity = new Entity();
        entity.reference = new Reference();

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Reference));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('reference');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._referenceMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal(entity.reference);
            expect(value).to.be.equal(entity.reference);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addFieldConstraint('reference', new Valid());
        this._referenceMetadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(entity, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('reference');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal(entity.reference);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testReferencePropertyConstraint() {
        const entity = new Entity();
        entity.reference = new Reference();
        entity.reference.value = 'Foobar';

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            const propertyMetadata = this._referenceMetadata.getAttributeMetadata('value');

            expect(context.className).to.be.equal(ReflectionClass.getClassName(Reference));
            expect(context.propertyName).to.be.equal('value');
            expect(context.getPropertyPath()).to.be.equal('reference.value');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(propertyMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal('Foobar');
            expect(value).to.be.equal('Foobar');

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addFieldConstraint('reference', new Valid());
        this._referenceMetadata.addFieldConstraint('value', new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(entity, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('reference.value');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal('Foobar');
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testReferenceGetterConstraint() {
        const entity = new Entity();
        entity.reference = new Reference();
        entity.reference.privateValue = 'Bamboo';

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            const propertyMetadata = this._referenceMetadata.getAttributeMetadata('privateValue');

            expect(context.className).to.be.equal(ReflectionClass.getClassName(Reference));
            expect(context.propertyName).to.be.equal('privateValue');
            expect(context.getPropertyPath()).to.be.equal('reference.privateValue');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(propertyMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal('Bamboo');
            expect(value).to.be.equal('Bamboo');

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addFieldConstraint('reference', new Valid());
        this._referenceMetadata.addPropertyGetterConstraint('privateValue', new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(entity, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('reference.privateValue');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal('Bamboo');
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testsIgnoreNullReference() {
        const entity = new Entity();
        entity.reference = null;

        this._metadata.addFieldConstraint('reference', new Valid());
        const violations = await this.validate(entity);

        expect(violations).to.have.length(0);
    }

    async testFailOnScalarReferences() {
        const entity = new Entity();
        entity.reference = 'string';

        this._metadata.addFieldConstraint('reference', new Valid());

        try {
            await this.validate(entity);
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceof(RuntimeException);
        }
    }

    @dataProvider('getConstraintMethods')
    async testHashmapReference(constraintMethod) {
        const entity = new Entity();
        entity.reference = { key: new Reference() };

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Reference));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('reference[key]');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._referenceMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal(entity.reference.key);
            expect(value).to.be.equal(entity.reference.key);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata[constraintMethod]('reference', new Valid());
        this._referenceMetadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(entity, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('reference[key]');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal(entity.reference.key);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    @dataProvider('getConstraintMethods')
    async testRecursiveArrayReference(constraintMethod) {
        const entity = new Entity();
        entity.reference = [ { key: new Reference() } ];

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback = (value, context) => {
            expect(context.className).to.be.equal(ReflectionClass.getClassName(Reference));
            expect(context.propertyName).to.be.null;
            expect(context.getPropertyPath()).to.be.equal('reference[0][key]');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(this._referenceMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal(entity.reference[0].key);
            expect(value).to.be.equal(entity.reference[0].key);

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata[constraintMethod]('reference', new Valid());
        this._referenceMetadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(entity, null, 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('reference[0][key]');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal(entity.reference[0].key);
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testOnlyCascadedArraysAreTraversed() {
        const entity = new Entity();
        entity.reference = { key: new Reference() };

        const callback = (value, context) => {
            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata.addFieldConstraint('reference', new Callback({
            callback: () => { },
            groups: 'Group',
        }));
        this._referenceMetadata.addConstraint(new Callback({
            callback,
            groups: 'Group',
        }));

        const violations = await this.validate(entity, null, 'Group');
        expect(violations).to.have.length(0);
    }

    @dataProvider('getConstraintMethods')
    async testArrayTraversalCannotBeDisabled(constraintMethod) {
        const entity = new Entity();
        entity.reference = { key: new Reference() };

        const callback = (value, context) => {
            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata[constraintMethod]('reference', new Valid({
            traverse: false,
        }));
        this._referenceMetadata.addConstraint(new Callback(callback));

        const violations = await this.validate(entity);
        expect(violations).to.have.length(1);
    }

    @dataProvider('getConstraintMethods')
    async testRecursiveArrayTraversalCannotBeDisabled(constraintMethod) {
        const entity = new Entity();
        entity.reference = [ null, null, { key: new Reference() } ];

        const callback = (value, context) => {
            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        this._metadata[constraintMethod]('reference', new Valid({
            traverse: false,
        }));

        this._referenceMetadata.addConstraint(new Callback(callback));

        const violations = await this.validate(entity);
        expect(violations).to.have.length(1);
    }

    @dataProvider('getConstraintMethods')
    async testIgnoreScalarsDuringArrayTraversal(constraintMethod) {
        const entity = new Entity();
        entity.reference = [ 'string', 1234 ];

        this._metadata[constraintMethod]('reference', new Valid());
        const violations = await this.validate(entity);
        expect(violations).to.have.length(0);
    }

    @dataProvider('getConstraintMethods')
    async testIgnoreNullDuringArrayTraversal(constraintMethod) {
        const entity = new Entity();
        entity.reference = [ null ];

        this._metadata[constraintMethod]('reference', new Valid());
        const violations = await this.validate(entity);
        expect(violations).to.have.length(0);
    }

    async testValidateProperty() {
        const entity = new Entity();
        entity.firstName = 'Alessandro';
        entity.setLastName('Chitolina');

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback1 = (value, context) => {
            const propertyMetadata = this._metadata.getAttributeMetadata('firstName');

            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.equal('firstName');
            expect(context.getPropertyPath()).to.be.equal('firstName');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(propertyMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal('Alessandro');
            expect(value).to.be.equal('Alessandro');

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        const callback2 = (value, context) => {
            context.addViolation('Other violation');
        };

        this._metadata.addFieldConstraint('firstName', new Callback({
            callback: callback1,
            groups: 'Group',
        }));
        this._metadata.addFieldConstraint('_lastName', new Callback({
            callback: callback2,
            groups: 'Group',
        }));

        const violations = await this.validateProperty(entity, 'firstName', 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('firstName');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal('Alessandro');
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testValidatePropertyWithoutConstraints() {
        const entity = new Entity();
        const violations = await this.validateProperty(entity, '_lastName');

        expect(violations).to.have.length(0, '.validateProperty() returns no violations if no constraints have been configured for the property being validated');
    }

    async testValidatePropertyValue() {
        const entity = new Entity();
        entity.setLastName('Chitolina');

        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback1 = (value, context) => {
            const propertyMetadata = this._metadata.getAttributeMetadata('firstName');

            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.equal('firstName');
            expect(context.getPropertyPath()).to.be.equal('firstName');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(propertyMetadata);
            expect(context.root).to.be.equal(entity);
            expect(context.value).to.be.equal('Alessandro');
            expect(value).to.be.equal('Alessandro');

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        const callback2 = (value, context) => {
            context.addViolation('Other violation');
        };

        this._metadata.addFieldConstraint('firstName', new Callback({
            callback: callback1,
            groups: 'Group',
        }));
        this._metadata.addFieldConstraint('_lastName', new Callback({
            callback: callback2,
            groups: 'Group',
        }));

        const violations = await this.validatePropertyValue(entity, 'firstName', 'Alessandro', 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('firstName');
        expect(violations.get(0).root).to.be.equal(entity);
        expect(violations.get(0).invalidValue).to.be.equal('Alessandro');
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testValidatePropertyValueWithClassName() {
        /**
         * @param {*} value
         * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
         */
        const callback1 = (value, context) => {
            const propertyMetadata = this._metadata.getAttributeMetadata('firstName');

            expect(context.className).to.be.equal(ReflectionClass.getClassName(Entity));
            expect(context.propertyName).to.be.equal('firstName');
            expect(context.getPropertyPath()).to.be.equal('');
            expect(context.group).to.be.equal('Group');
            expect(context.metadata).to.be.equal(propertyMetadata);
            expect(context.root).to.be.equal('Alessandro');
            expect(context.value).to.be.equal('Alessandro');
            expect(value).to.be.equal('Alessandro');

            context.addViolation('Message %param%', { '%param%': 'value' });
        };

        const callback2 = (value, context) => {
            context.addViolation('Other violation');
        };

        this._metadata.addFieldConstraint('firstName', new Callback({
            callback: callback1,
            groups: 'Group',
        }));
        this._metadata.addFieldConstraint('_lastName', new Callback({
            callback: callback2,
            groups: 'Group',
        }));

        const violations = await this.validatePropertyValue(Entity, 'firstName', 'Alessandro', 'Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Message value');
        expect(violations.get(0).messageTemplate).to.be.equal('Message %param%');
        expect(violations.get(0).parameters).to.be.deep.equal({ '%param%': 'value' });
        expect(violations.get(0).propertyPath).to.be.equal('');
        expect(violations.get(0).root).to.be.equal('Alessandro');
        expect(violations.get(0).invalidValue).to.be.equal('Alessandro');
        expect(violations.get(0).plural).to.be.null;
        expect(violations.get(0).code).to.be.null;
    }

    async testValidatePropertyValueWithoutConstraints() {
        const entity = new Entity();
        const violations = await this.validatePropertyValue(entity, '_lastName', 'foo');

        expect(violations).to.have.length(0, '.validatePropertyValue() returns no violations if no constraints have been configured for the property being validated');
    }

    async testValidateObjectOnlyOncePerGroup() {
        const entity = new Entity();
        entity.reference = new Reference();
        entity.reference2 = entity.reference;

        const callback = (value, context) => {
            context.addViolation('Message');
        };

        this._metadata.addFieldConstraint('reference', new Valid());
        this._metadata.addFieldConstraint('reference2', new Valid());
        this._referenceMetadata.addConstraint(new Callback(callback));

        const violations = await this.validate(entity);
        expect(violations).to.have.length(1);
    }

    async testValidateDifferentObjectsSeparately() {
        const entity = new Entity();
        entity.reference = new Reference();
        entity.reference2 = new Reference();

        const callback = (value, context) => {
            context.addViolation('Message');
        };

        this._metadata.addFieldConstraint('reference', new Valid());
        this._metadata.addFieldConstraint('reference2', new Valid());
        this._referenceMetadata.addConstraint(new Callback(callback));

        const violations = await this.validate(entity);
        expect(violations).to.have.length(2);
    }

    async testValidateSingleGroup() {
        const entity = new Entity();

        const callback = (value, context) => {
            context.addViolation('Message');
        };

        this._metadata.addConstraint(new Callback({ callback, groups: 'Group 1' }));
        this._metadata.addConstraint(new Callback({ callback, groups: 'Group 2' }));

        const violations = await this.validate(entity, null, 'Group 2');
        expect(violations).to.have.length(1);
    }

    async testValidateMultipleGroups() {
        const entity = new Entity();

        const callback = (value, context) => {
            context.addViolation('Message');
        };

        this._metadata.addConstraint(new Callback({ callback, groups: 'Group 1' }));
        this._metadata.addConstraint(new Callback({ callback, groups: 'Group 2' }));

        const violations = await this.validate(entity, null, [ 'Group 1', 'Group 2' ]);
        expect(violations).to.have.length(2);
    }

    async testReplaceDefaultGroupByGroupSequenceObject() {
        const entity = new Entity();

        const callback1 = (value, context) => context.addViolation('Violation in Group 2');
        const callback2 = (value, context) => context.addViolation('Violation in Group 3');

        this._metadata.addConstraint(new Callback({ callback: () => { }, groups: 'Group 1' }));
        this._metadata.addConstraint(new Callback({ callback: callback1, groups: 'Group 2' }));
        this._metadata.addConstraint(new Callback({ callback: callback2, groups: 'Group 3' }));

        const sequence = new GroupSequence([ 'Group 1', 'Group 2', 'Group 3', 'Entity' ]);
        this._metadata.setGroupSequence(sequence);

        const violations = await this.validate(entity, null, 'Default');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Violation in Group 2');
    }

    async testReplaceDefaultGroupByGroupSequenceArray() {
        const entity = new Entity();

        const callback1 = (value, context) => context.addViolation('Violation in Group 2');
        const callback2 = (value, context) => context.addViolation('Violation in Group 3');

        this._metadata.addConstraint(new Callback({ callback: () => { }, groups: 'Group 1' }));
        this._metadata.addConstraint(new Callback({ callback: callback1, groups: 'Group 2' }));
        this._metadata.addConstraint(new Callback({ callback: callback2, groups: 'Group 3' }));

        this._metadata.setGroupSequence([ 'Group 1', 'Group 2', 'Group 3', 'Entity' ]);

        const violations = await this.validate(entity, null, 'Default');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Violation in Group 2');
    }

    async testPropagateDefaultGroupToReferenceWhenReplacingDefaultGroup() {
        const entity = new Entity();
        entity.reference = new Reference();

        const callback1 = (value, context) => context.addViolation('Violation in Default group');
        const callback2 = (value, context) => context.addViolation('Violation in group sequence');

        this._metadata.addFieldConstraint('reference', new Valid());
        this._referenceMetadata.addConstraint(new Callback({ callback: callback1, groups: 'Default' }));
        this._referenceMetadata.addConstraint(new Callback({ callback: callback2, groups: 'Group 1' }));

        const sequence = new GroupSequence([ 'Group 1', 'Entity' ]);
        this._metadata.setGroupSequence(sequence);

        const violations = await this.validate(entity, null, 'Default');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Violation in Default group');
    }

    async testValidateCustomGroupWhenDefaultGroupWasReplaced() {
        const entity = new Entity();

        const callback1 = (value, context) => context.addViolation('Violation in other group');
        const callback2 = (value, context) => context.addViolation('Violation in group sequence');

        this._metadata.addConstraint(new Callback({ callback: callback1, groups: 'Other Group' }));
        this._metadata.addConstraint(new Callback({ callback: callback2, groups: 'Group 1' }));

        const sequence = new GroupSequence([ 'Group 1', 'Entity' ]);
        this._metadata.setGroupSequence(sequence);

        const violations = await this.validate(entity, null, 'Other Group');

        expect(violations).to.have.length(1);
        expect(violations.get(0).message).to.be.equal('Violation in other group');
    }

    @dataProvider('getTestReplaceDefaultGroup')
    async testReplaceDefaultGroup(sequence, assertViolations) {
        const entity = new GroupSequenceProviderEntity(sequence);

        const callback1 = (value, context) => context.addViolation('Violation in Group 2');
        const callback2 = (value, context) => context.addViolation('Violation in Group 3');

        const metadata = new ClassMetadata(new ReflectionClass(entity));
        metadata.addConstraint(new Callback({ callback: () => {}, groups: 'Group 1' }));
        metadata.addConstraint(new Callback({ callback: callback1, groups: 'Group 2' }));
        metadata.addConstraint(new Callback({ callback: callback2, groups: 'Group 3' }));
        metadata.setGroupSequenceProvider(true);

        this._metadataFactory.addMetadata(metadata);

        const violations = await this.validate(entity, null, 'Default');

        expect(violations).to.have.length(assertViolations.length);
        for (const [ key, message ] of __jymfony.getEntries(assertViolations)) {
            expect(violations.get(key).message).to.be.equal(message);
        }
    }

    getConstraintMethods() {
        return [
            [ 'addFieldConstraint' ],
            [ 'addGetterConstraint' ],
        ];
    }

    getTestReplaceDefaultGroup() {
        return [
            [
                new GroupSequence([ 'Group 1', 'Group 2', 'Group 3', 'Entity' ]),
                [ 'Violation in Group 2' ],
            ],
            [
                [ 'Group 1', 'Group 2', 'Group 3', 'Entity' ],
                [ 'Violation in Group 2' ],
            ],
            [
                new GroupSequence([ 'Group 1', [ 'Group 2', 'Group 3' ], 'Entity' ]),
                [
                    'Violation in Group 2',
                    'Violation in Group 3',
                ],
            ],
            [
                [ 'Group 1', [ 'Group 2', 'Group 3' ], 'Entity' ],
                [
                    'Violation in Group 2',
                    'Violation in Group 3',
                ],
            ],
        ];
    }
}
