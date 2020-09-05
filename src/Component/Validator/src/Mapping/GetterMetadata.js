const MemberMetadata = Jymfony.Component.Validator.Mapping.MemberMetadata;
const ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

/**
 * Stores all metadata needed for validating a class property via its getter
 * method.
 *
 * The getter will be invoked by reflection, so the access of private and
 * protected getters is supported.
 *
 * This class supports serialization and cloning.
 *
 * @see Jymfony.Component.Validator.Mapping.PropertyMetadataInterface
 * @memberOf Jymfony.Component.Validator.Mapping
 */
export default class GetterMetadata extends MemberMetadata {
    /**
     * @param {string} klass The class the getter is defined on
     * @param {string} property The property which the getter returns
     * @param {string|null} method The method that is called to retrieve the value being validated (null for auto-detection)
     *
     * @throws {Jymfony.Component.Validator.Exception.ValidatorException}
     */
    __construct(klass, property, method = null) {
        const reflectionClass = new ReflectionClass(klass);

        if (null === method) {
            const getMethod = 'get' + property[0].toUpperCase() + property.substr(1);
            const isMethod = 'is' + property[0].toUpperCase() + property.substr(1);
            const hasMethod = 'has' + property[0].toUpperCase() + property.substr(1);

            if (reflectionClass.hasReadableProperty(property)) {
                method = property;
            } else if (reflectionClass.hasMethod(getMethod)) {
                method = getMethod;
            } else if (reflectionClass.hasMethod(isMethod)) {
                method = isMethod;
            } else if (reflectionClass.hasMethod(hasMethod)) {
                method = hasMethod;
            } else {
                throw new ValidatorException(__jymfony.sprintf('Neither of these methods exist in class "%s": "%s", "%s", "%s".', klass, getMethod, isMethod, hasMethod));
            }
        } else if (! reflectionClass.hasMethod(method) && ! reflectionClass.hasReadableProperty(method)) {
            throw new ValidatorException(__jymfony.sprintf('The "%s()" nor "get %s()" getter method does not exist in class "%s".', method, klass));
        }

        super.__construct(klass, method, property);
    }

    /**
     * @inheritdoc
     */
    getPropertyValue(object) {
        return this._newReflectionMember(object).invoke(object);
    }

    /**
     * @inheritdoc
     */
    _newReflectionMember(objectOrClassName) {
        const reflectionClass = new ReflectionClass(objectOrClassName);
        if (reflectionClass.hasReadableProperty(this.name)) {
            return reflectionClass.getReadableProperty(this.name);
        }

        return reflectionClass.getMethod(this.name);
    }
}
