declare namespace Jymfony.Component.Validator.Mapping {
    import MemberMetadata = Jymfony.Component.Validator.Mapping.MemberMetadata;

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
     */
    export class GetterMetadata extends MemberMetadata {
        /**
         * @param klass The class the getter is defined on
         * @param property The property which the getter returns
         * @param method The method that is called to retrieve the value being validated (null for auto-detection)
         *
         * @throws {Jymfony.Component.Validator.Exception.ValidatorException}
         */
        __construct(klass: string, property: string, method?: string | null): void;
        constructor(klass: string, property: string, method?: string | null);

        /**
         * @inheritdoc
         */
        getPropertyValue(object: object): any;

        /**
         * @inheritdoc
         */
        protected _newReflectionMember(objectOrClassName: object | string): ReflectionMethod | ReflectionProperty;
    }
}
