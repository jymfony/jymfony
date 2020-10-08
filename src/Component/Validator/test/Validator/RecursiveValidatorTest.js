import { AbstractTest } from './AbstractTest';

const All = Jymfony.Component.Validator.Constraints.All;
const CascadedChild = Jymfony.Component.Validator.Fixtures.CascadedChild;
const CascadingEntity = Jymfony.Component.Validator.Fixtures.CascadingEntity;
const ChildA = Jymfony.Component.Validator.Fixtures.ChildA;
const ChildB = Jymfony.Component.Validator.Fixtures.ChildB;
const ClassMetadata = Jymfony.Component.Validator.Mapping.ClassMetadata;
const Collection = Jymfony.Component.Validator.Constraints.Collection;
const ConstraintValidatorFactory = Jymfony.Component.Validator.ConstraintValidatorFactory;
const ContextualValidatorInterface = Jymfony.Component.Validator.Validator.ContextualValidatorInterface;
const Entity = Jymfony.Component.Validator.Fixtures.Entity;
const EntityParent = Jymfony.Component.Validator.Fixtures.EntityParent;
const EntityWithGroupedConstraintOnMethods = Jymfony.Component.Validator.Fixtures.EntityWithGroupedConstraintOnMethods;
const ExecutionContextFactory = Jymfony.Component.Validator.Context.ExecutionContextFactory;
const GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;
const IsTrue = Jymfony.Component.Validator.Constraints.IsTrue;
const Length = Jymfony.Component.Validator.Constraints.Length;
const LocaleAwareInterface = Jymfony.Contracts.Translation.LocaleAwareInterface;
const NotBlank = Jymfony.Component.Validator.Constraints.NotBlank;
const NotNull = Jymfony.Component.Validator.Constraints.NotNull;
const Optional = Jymfony.Component.Validator.Constraints.Optional;
const RecursiveValidator = Jymfony.Component.Validator.Validator.RecursiveValidator;
const Required = Jymfony.Component.Validator.Constraints.Required;
const TranslatorInterface = Jymfony.Contracts.Translation.TranslatorInterface;
const TranslatorTrait = Jymfony.Contracts.Translation.TranslatorTrait;
const Type = Jymfony.Component.Validator.Constraints.Type;
const Valid = Jymfony.Component.Validator.Constraints.Valid;
const { expect } = require('chai');

export default class RecursiveValidatorTest extends AbstractTest {
    createValidator(metadataFactory) {
        const translator = new class
            extends implementationOf(TranslatorInterface, LocaleAwareInterface, TranslatorTrait) { }();
        /*
         * Force the locale to be 'en' when no translator is provided rather than relying on the Intl default locale
         * This avoids depending on Intl or the stub implementation being available. It also ensures that Jymfony
         * validation messages are pluralized properly even when the default locale gets changed because they are in
         * English.
         */
        translator.locale = 'en';

        const contextFactory = new ExecutionContextFactory(translator);
        const validatorFactory = new ConstraintValidatorFactory();

        return new RecursiveValidator(contextFactory, metadataFactory, validatorFactory);
    }

    async testRelationBetweenChildAAndChildB() {
        const entity = new Entity();
        const childA = new ChildA();
        const childB = new ChildB();

        childA.childB = childB;
        childB.childA = childA;

        childA.name = false;
        childB.name = 'fake';
        entity.childA = [ childA ];
        entity.childB = [ childB ];

        const validatorContext = this.prophesize(ContextualValidatorInterface);
        validatorContext.violations().willReturn();
        validatorContext.validate(entity, null, [])
            .shouldBeCalledTimes(1)
            .willReturnThis();

        const validator = this.prophesize(RecursiveValidator);
        validator.startContext(entity)
            .shouldBeCalledTimes(1)
            .willReturn(validatorContext);

        await RecursiveValidator.prototype.validate.call(validator.reveal(), entity, null, []);
    }

    async testCollectionConstraintValidateAllGroupsForNestedConstraints() {
        this._metadata.addFieldConstraint('data', new Collection({ fields: {
            one: [ new NotBlank({ groups: 'one' }), new Length({ min: 2, groups: 'two' }) ],
            two: [ new NotBlank({ groups: 'two' }) ],
        } }));

        const entity = new Entity();
        entity.data = { one: 't', two: '' };

        const violations = await this.validator.validate(entity, null, [ 'one', 'two' ]);

        expect(violations).to.have.length(2);
        expect(violations.get(0).constraint).to.be.instanceOf(Length);
        expect(violations.get(1).constraint).to.be.instanceOf(NotBlank);
    }

    async testCollectionConstraintValidateAllEntriesInMap() {
        this._metadata.addFieldConstraint('data', new Collection({ fields: {
            one: [ new NotBlank({ groups: 'one' }), new Length({ min: 2, groups: 'two' }) ],
            two: [ new NotBlank({ groups: 'two' }) ],
        } }));

        const entity = new Entity();
        entity.data = new Map();
        entity.data.set('one', 't');
        entity.data.set('two', '');

        const violations = await this.validator.validate(entity, null, [ 'one', 'two' ]);

        expect(violations).to.have.length(2);
        expect(violations.get(0).constraint).to.be.instanceOf(Length);
        expect(violations.get(0).propertyPath).to.be.equal('data.one');
        expect(violations.get(1).constraint).to.be.instanceOf(NotBlank);
        expect(violations.get(1).propertyPath).to.be.equal('data.two');
    }

    async testGroupedMethodConstraintValidateInSequence() {
        const metadata = new ClassMetadata(new ReflectionClass(EntityWithGroupedConstraintOnMethods));
        metadata.addFieldConstraint('bar', new NotNull({ groups: 'Foo' }));
        metadata.addGetterMethodConstraint('validInFoo', 'isValidInFoo', new IsTrue({ groups: 'Foo' }));
        metadata.addGetterMethodConstraint('bar', 'getBar', new NotNull({ groups: 'Bar' }));

        this._metadataFactory.addMetadata(metadata);

        const entity = new EntityWithGroupedConstraintOnMethods();
        const groups = new GroupSequence([ 'EntityWithGroupedConstraintOnMethods', 'Foo', 'Bar' ]);

        const violations = await this.validator.validate(entity, null, groups);

        expect(violations).to.have.length(2);
        expect(violations.get(0).constraint).to.be.instanceOf(NotNull);
        expect(violations.get(1).constraint).to.be.instanceOf(IsTrue);
    }

    async testValidConstraintOnGetterReturningNull() {
        const metadata = new ClassMetadata(new ReflectionClass(EntityParent));
        metadata.addGetterConstraint('child', new Valid());

        this._metadataFactory.addMetadata(metadata);
        const violations = await this.validator.validate(new EntityParent());

        expect(violations).to.have.length(0);
    }

    async testNotNullConstraintOnGetterReturningNull() {
        const metadata = new ClassMetadata(new ReflectionClass(EntityParent));
        metadata.addGetterConstraint('child', new NotNull());

        this._metadataFactory.addMetadata(metadata);
        const violations = await this.validator.validate(new EntityParent());

        expect(violations).to.have.length(1);
        expect(violations.get(0).constraint).to.be.instanceOf(NotNull);
    }

    async testAllConstraintValidateAllGroupsForNestedConstraints() {
        this._metadata.addFieldConstraint('data', new All({ constraints: [
            new NotBlank({ groups: 'one' }),
            new Length({ min: 2, groups: 'two' }),
        ] }));

        const entity = new Entity();
        entity.data = { one: 't', two: '' };

        const violations = await this.validator.validate(entity, null, [ 'one', 'two' ]);

        expect(violations).to.have.length(3);
        expect(violations.get(0).constraint).to.be.instanceOf(NotBlank);
        expect(violations.get(1).constraint).to.be.instanceOf(Length);
        expect(violations.get(2).constraint).to.be.instanceOf(Length);
    }

    async testRequiredConstraintIsIgnored() {
        const violations = await this.validator.validate([], new Required());
        expect(violations).to.have.length(0);
    }

    async testOptionalConstraintIsIgnored() {
        const violations = await this.validator.validate([], new Optional());
        expect(violations).to.have.length(0);
    }

    async testValidateDoNotCascadeNestedObjectsAndArraysByDefault() {
        this._metadataFactory.addMetadata(new ClassMetadata(new ReflectionClass(CascadingEntity)));
        this._metadataFactory.addMetadata((new ClassMetadata(new ReflectionClass(CascadedChild)))
            .addFieldConstraint('name', new NotNull())
        );

        const entity = new CascadingEntity();
        entity.requiredChild = new CascadedChild();
        entity.optionalChild = new CascadedChild();
        entity.children = [ new CascadedChild() ];

        CascadingEntity.staticChild = new CascadedChild();
        const violations = await this.validator.validate(entity);
        CascadingEntity.staticChild = undefined;

        expect(violations).to.have.length(0);
    }

    async testValidateTraverseNestedArrayByDefaultIfConstrainedWithoutCascading() {
        this._metadataFactory.addMetadata((new ClassMetadata(new ReflectionClass(CascadingEntity)))
            .addFieldConstraint('children', new All([
                new Type(CascadedChild),
            ]))
        );
        this._metadataFactory.addMetadata((new ClassMetadata(new ReflectionClass(CascadedChild)))
            .addFieldConstraint('name', new NotNull())
        );

        const entity = new CascadingEntity();
        entity.children = [
            {},
            new CascadedChild(),
        ];

        const violations = await this.validator.validate(entity);

        expect(violations).to.have.length(1);
        expect(violations.get(0).constraint).to.be.instanceOf(Type);
    }

    async testValidateCascadeWithValid() {
        this._metadataFactory.addMetadata((new ClassMetadata(new ReflectionClass(CascadingEntity)))
            .addFieldConstraint('requiredChild', new Valid())
            .addFieldConstraint('optionalChild', new Valid())
            .addFieldConstraint('staticChild', new Valid())
            .addFieldConstraint('children', new Valid())
        );
        this._metadataFactory.addMetadata((new ClassMetadata(new ReflectionClass(CascadedChild)))
            .addFieldConstraint('name', new NotNull())
        );

        const entity = new CascadingEntity();
        entity.requiredChild = new CascadedChild();
        entity.children = [
            new CascadedChild(),
            null,
        ];

        CascadingEntity.staticChild = new CascadedChild();
        const violations = await this.validator.validate(entity);
        CascadingEntity.staticChild = undefined;

        expect(violations).to.have.length(3);
        expect(violations.get(0).constraint).to.be.instanceOf(NotNull);
        expect(violations.get(1).constraint).to.be.instanceOf(NotNull);
        expect(violations.get(2).constraint).to.be.instanceOf(NotNull);
        expect(violations.get(0).propertyPath).to.be.equal('requiredChild.name');
        expect(violations.get(1).propertyPath).to.be.equal('staticChild.name');
        expect(violations.get(2).propertyPath).to.be.equal('children[0].name');
    }
}
