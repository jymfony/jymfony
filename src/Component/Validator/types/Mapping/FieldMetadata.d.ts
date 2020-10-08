declare namespace Jymfony.Component.Validator.Mapping {
    import MemberMetadata = Jymfony.Component.Validator.Mapping.MemberMetadata;

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
     */
    export class FieldMetadata extends MemberMetadata {
        /**
         * @param klass The class this property is defined on
         * @param name  The name of this property
         *
         * @throws {Jymfony.Component.Validator.Exception.ValidatorException}
         */
        __construct(klass: string, name: string): void;
        constructor(klass: string, name: string);

        /**
         * @inheritdoc
         */
        getPropertyValue(object: object): any;

        /**
         * @inheritdoc
         */
        protected _newReflectionMember(objectOrClassName): ReflectionField;
    }
}
