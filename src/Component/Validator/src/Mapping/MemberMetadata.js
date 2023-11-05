const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const GenericMetadata = Jymfony.Component.Validator.Mapping.GenericMetadata;
const PropertyMetadataInterface = Jymfony.Component.Validator.Mapping.PropertyMetadataInterface;

/**
 * Stores all metadata needed for validating a class property.
 *
 * The method of accessing the property's value must be specified by subclasses
 * by implementing the {@link _newReflectionMember()} method.
 *
 * This class supports serialization and cloning.
 *
 * @memberOf Jymfony.Component.Validator.Mapping
 *
 * @see Jymfony.Component.Validator.Mapping.PropertyMetadataInterface
 */
export default class MemberMetadata extends mix(GenericMetadata, PropertyMetadataInterface) {
    /**
     * @type {string}
     *
     * @private
     */
    _class;

    /**
     * @type {string}
     *
     * @private
     */
    _name;

    /**
     * @type {string}
     *
     * @private
     */
    _property;

    /**
     * @type {Object.<string|symbol, (ReflectionMethod|ReflectionProperty|ReflectionField)>}
     *
     * @private
     */
    _reflMember = {};

    /**
     * @param {string} klass The name of the class this member is defined on
     * @param {string} name The name of the member
     * @param {string} property The property the member belongs to
     */
    __construct(klass, name, property) {
        this._class = klass;
        this._name = name;
        this._property = property;
    }

    /**
     * @inheritdoc
     */
    addConstraint(constraint) {
        const targets = isArray(constraint.targets) ? constraint.targets : [ constraint.targets ];
        if (! targets.includes(Constraint.PROPERTY_CONSTRAINT)) {
            throw new ConstraintDefinitionException(__jymfony.sprintf('The constraint %s cannot be put on properties or getters', ReflectionClass.getClassName(constraint)));
        }

        super.addConstraint(constraint);

        return this;
    }

    /**
     * @inheritdoc
     */
    __sleep() {
        return [ ...super.__sleep(), '_class', '_name', '_property' ];
    }

    /**
     * Returns the name of the member.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @inheritdoc
     */
    get className() {
        return this._class;
    }

    /**
     * @inheritdoc
     */
    get propertyName() {
        return this._property;
    }

    /**
     * Returns whether this member is public.
     *
     * @param {object|string} objectOrClassName The object or the class name
     *
     * @returns {boolean}
     */
    isPublic(objectOrClassName) {
        const reflection = this.getReflectionMember(objectOrClassName);

        return (reflection instanceof ReflectionField || reflection instanceof ReflectionMethod) && ! reflection.isPrivate;
    }

    /**
     * Returns whether this member is private.
     *
     * @param {object|string} objectOrClassName The object or the class name
     *
     * @returns {boolean}
     */
    isPrivate(objectOrClassName) {
        return ! this.isPublic(objectOrClassName);
    }

    /**
     * Returns the reflection instance for accessing the member's value.
     *
     * @param {object|string} objectOrClassName The object or the class name
     *
     * @returns {ReflectionMethod|ReflectionField|ReflectionProperty} The reflection instance
     */
    getReflectionMember(objectOrClassName) {
        const className = isString(objectOrClassName) ? objectOrClassName : ReflectionClass.getClassName(objectOrClassName);
        if (! this._reflMember[className]) {
            this._reflMember[className] = this._newReflectionMember(objectOrClassName);
        }

        return this._reflMember[className];
    }

    /**
     * Creates a new reflection instance for accessing the member's value.
     * Must be implemented by subclasses.
     *
     * @param {object|string} objectOrClassName The object or the class name
     *
     * @returns {ReflectionMethod|ReflectionProperty|ReflectionField} The reflection instance
     *
     * @abstract
     * @protected
     */
    _newReflectionMember(objectOrClassName) { // eslint-disable-line no-unused-vars
        throw new Error('_newReflectionMember method must be implemented');
    }
}
