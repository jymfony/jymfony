const ClassMetadataInterface = Jymfony.Component.Validator.Mapping.ClassMetadataInterface;
const Composite = Jymfony.Component.Validator.Constraints.Composite;
const ConstraintViolation = Jymfony.Component.Validator.ConstraintViolation;
const ConstraintViolationBuilder = Jymfony.Component.Validator.Violation.ConstraintViolationBuilder;
const ConstraintViolationList = Jymfony.Component.Validator.ConstraintViolationList;
const ExecutionContextInterface = Jymfony.Component.Validator.Context.ExecutionContextInterface;
const LazyProperty = Jymfony.Component.Validator.Validator.LazyProperty;
const MemberMetadata = Jymfony.Component.Validator.Mapping.MemberMetadata;
const PropertyMetadataInterface = Jymfony.Component.Validator.Mapping.PropertyMetadataInterface;
const PropertyPath = Jymfony.Component.Validator.Util.PropertyPath;
const Valid = Jymfony.Component.Validator.Constraints.Valid;

/**
 * The context used and created by {@link ExecutionContextFactory}.
 *
 * @memberOf Jymfony.Component.Validator.Context
 *
 * @see ExecutionContextInterface
 *
 * @internal Code against ExecutionContextInterface instead.
 */
export default class ExecutionContext extends implementationOf(ExecutionContextInterface) {
    /**
     * @param {Jymfony.Component.Validator.Validator.ValidatorInterface} validator
     * @param {*} root The root value of the validated object graph
     * @param {Jymfony.Contracts.Translation.TranslatorInterface} translator
     * @param {string} [translationDomain]
     *
     * @internal Called by {@link ExecutionContextFactory}. Should not be used in user code.
     */
    __construct(validator, root, translator, translationDomain = null) {
        /**
         * @type {Jymfony.Component.Validator.Validator.ValidatorInterface}
         *
         * @private
         */
        this._validator = validator;

        /**
         * The root value of the validated object graph.
         *
         * @type {*}
         */
        this._root = root;

        /**
         * @type {Jymfony.Contracts.Translation.TranslatorInterface}
         *
         * @private
         */
        this._translator = translator;

        /**
         * @type {string}
         *
         * @private
         */
        this._translationDomain = translationDomain;

        /**
         * The violations generated in the current context.
         *
         * @type {Jymfony.Component.Validator.ConstraintViolationListInterface}
         */
        this._violations = new ConstraintViolationList();

        /**
         * The currently validated value.
         *
         * @type {*}
         */
        this._value = undefined;

        /**
         * The currently validated object.
         *
         * @type {object}
         */
        this._object = undefined;

        /**
         * The property path leading to the current value.
         *
         * @type {string}
         */
        this._propertyPath = '';

        /**
         * The current validation metadata.
         *
         * @type {Jymfony.Contracts.Metadata.MetadataInterface}
         *
         * @private
         */
        this._metadata = undefined;

        /**
         * The currently validated group.
         *
         * @type {string|null}
         *
         * @private
         */
        this._group = undefined;

        /**
         * The currently validated constraint.
         *
         * @type {Jymfony.Component.Validator.Constraint|null}
         */
        this._constraint = undefined;

        /**
         * Stores which objects have been validated in which group.
         *
         * @type {WeakMap.<object, Set<string>>}
         *
         * @private
         */
        this._validatedObjects = new WeakMap();

        /**
         * Stores which class constraint has been validated for which object.
         *
         * @type {WeakMap.<object, Set<string>>}
         *
         * @private
         */
        this._validatedConstraints = new WeakMap();

        /**
         * Stores already volidated composite/valid constraints for groups.
         *
         * @type {WeakMap<object, Map<string, Set<string>>>}
         *
         * @private
         */
        this._compositeValidatedConstraints = new WeakMap();
    }

    /**
     * @inheritdoc
     */
    setNode(value, object, metadata, propertyPath) {
        this._value = value;
        this._object = object;
        this._metadata = metadata;
        this._propertyPath = String(propertyPath);
    }

    /**
     * @inheritdoc
     */
    setGroup(group) {
        this._group = group;
    }

    /**
     * @inheritdoc
     */
    setConstraint(constraint) {
        this._constraint = constraint;
    }

    /**
     * @inheritdoc
     */
    addViolation(message, parameters = {}) {
        this._violations.add(new ConstraintViolation(
            this._translator.trans(message, parameters, this._translationDomain),
            message,
            parameters,
            this._root,
            this._propertyPath,
            this.value,
            null,
            null,
            this._constraint
        ));
    }

    /**
     * @inheritdoc
     */
    buildViolation(message, parameters = {}) {
        return new ConstraintViolationBuilder(
            this._violations,
            this._constraint,
            message,
            parameters,
            this._root,
            this._propertyPath,
            this.value,
            this._translator,
            this._translationDomain
        );
    }

    /**
     * @inheritdoc
     */
    get violations() {
        return this._violations;
    }

    /**
     * @inheritdoc
     */
    get validator() {
        return this._validator;
    }

    /**
     * @inheritdoc
     */
    get root() {
        return this._root;
    }

    /**
     * @inheritdoc
     */
    get value() {
        if (this._value instanceof LazyProperty) {
            return this._value.getPropertyValue();
        }

        return this._value;
    }

    /**
     * @inheritdoc
     */
    get object() {
        return this._object;
    }

    /**
     * @inheritdoc
     */
    get metadata() {
        return this._metadata;
    }

    /**
     * @inheritdoc
     */
    get group() {
        return this._group;
    }

    getConstraint() {
        return this._constraint;
    }

    /**
     * @inheritdoc
     */
    get className() {
        if (this._metadata instanceof MemberMetadata) {
            return this._metadata.className;
        }

        return this._metadata instanceof ClassMetadataInterface ? this._metadata.name : null;
    }

    /**
     * @inheritdoc
     */
    get propertyName() {
        return this._metadata instanceof PropertyMetadataInterface ? this._metadata.propertyName : null;
    }

    /**
     * @inheritdoc
     */
    getPropertyPath(subPath = '') {
        return PropertyPath.append(this._propertyPath, subPath);
    }

    /**
     * @inheritdoc
     */
    markGroupAsValidated(object, groupHash) {
        if (! this._validatedObjects.has(object)) {
            this._validatedObjects.set(object, new Set());
        }

        this._validatedObjects.get(object).add(groupHash);
    }

    /**
     * @inheritdoc
     */
    isGroupValidated(object, groupHash) {
        return this._validatedObjects.has(object) && this._validatedObjects.get(object).has(groupHash);
    }

    /**
     * @inheritdoc
     */
    markConstraintAsValidated(object, constraint, group) {
        if (constraint instanceof Composite || constraint instanceof Valid) {
            if (! this._compositeValidatedConstraints.has(object)) {
                this._compositeValidatedConstraints.set(object, new Map());
            }

            const byObject = this._compositeValidatedConstraints.get(object);
            if (! byObject.has(group)) {
                byObject.set(group, new Set());
            }

            const byGroup = byObject.get(group);
            byGroup.add(constraint);

            return;
        }

        if (! this._validatedConstraints.has(object)) {
            this._validatedConstraints.set(object, new Set());
        }

        this._validatedConstraints.get(object).add(constraint);
    }

    /**
     * @inheritdoc
     */
    isConstraintValidated(object, constraint, group) {
        if (constraint instanceof Composite || constraint instanceof Valid) {
            return this._compositeValidatedConstraints.has(object) &&
                this._compositeValidatedConstraints.get(object).has(group) &&
                this._compositeValidatedConstraints.get(object).get(group).has(constraint);
        }

        return this._validatedConstraints.has(object) && this._validatedConstraints.get(object).has(constraint);
    }
}
