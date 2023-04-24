const LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;
const MappingException = Jymfony.Component.Validator.Exception.MappingException;

/**
 * Loads validation metadata by calling a static method on the loaded class.
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class StaticMethodLoader extends implementationOf(LoaderInterface) {
    /**
     * Creates a new loader.
     *
     * @param {string} methodName The name of the static method to call
     */
    __construct(methodName = 'loadValidatorMetadata') {
        /**
         * @type {string}
         *
         * @protected
         */
        this._methodName = methodName;
    }

    /**
     * @inheritdoc
     */
    loadClassMetadata(metadata) {
        const reflClass = new ReflectionClass(metadata.name);

        if (! reflClass.isInterface && reflClass.hasMethod(this._methodName)) {
            const reflMethod = reflClass.getMethod(this._methodName);
            if (! reflMethod.isStatic) {
                throw new MappingException(__jymfony.sprintf('The method "%s:%s()" should be static.', reflClass.name, this._methodName));
            }

            if (reflMethod.reflectionClass.name === reflClass.name) {
                reflMethod.invoke(null, metadata);
            }
        }
    }
}
