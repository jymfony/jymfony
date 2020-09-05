const MemberMetadata = Jymfony.Component.Validator.Mapping.MemberMetadata;
const ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

/**
 * Stores all metadata needed for validating a class property.
 *
 * The value of the property is obtained by directly accessing the property.
 * The property will be accessed by reflection, so the access of private and
 * protected properties is supported.
 *
 * This class supports serialization and cloning.
 *
 * @see Jymfony.Component.Validator.Mapping.PropertyMetadataInterface
 * @memberOf Jymfony.Component.Validator.Mapping
 */
export default class FieldMetadata extends MemberMetadata {
    /**
     * @param {string} klass The class this property is defined on
     * @param {string} name  The name of this property
     *
     * @throws {Jymfony.Component.Validator.Exception.ValidatorException}
     */
    __construct(klass, name) {
        const reflectionClass = new ReflectionClass(klass);
        if (! reflectionClass.hasField(name)) {
            throw new ValidatorException(__jymfony.sprintf('Property "%s" does not exist in class "%s"', name, klass));
        }

        super.__construct(klass, name, name);
    }

    /**
     * @inheritdoc
     */
    getPropertyValue(object) {
        const reflectionField = this.getReflectionMember(object);

        return reflectionField.getValue(object);
    }

    /**
     * @inheritdoc
     */
    _newReflectionMember(objectOrClassName){
        let reflectionClass = new ReflectionClass(objectOrClassName);
        while (! reflectionClass.hasField(this.name)) {
            reflectionClass = reflectionClass.getParentClass();

            if (! reflectionClass) {
                throw new ValidatorException(__jymfony.sprintf('Field "%s" does not exist in class "%s".', this.name, ReflectionClass.getClassName(objectOrClassName)));
            }
        }

        const member = reflectionClass.getField(this.name);
        member.accessible = true;

        return member;
    }
}
