declare namespace Jymfony.Component.Validator.Mapping {
    import Constraint = Jymfony.Component.Validator.Constraint;
    import ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
    import GenericMetadata = Jymfony.Component.Validator.Mapping.GenericMetadata;
    import PropertyMetadataInterface = Jymfony.Component.Validator.Mapping.PropertyMetadataInterface;

    /**
     * Stores all metadata needed for validating a class property.
     *
     * The method of accessing the property's value must be specified by subclasses
     * by implementing the {@link _newReflectionMember()} method.
     *
     * This class supports serialization and cloning.
     *
     * @see Jymfony.Component.Validator.Mapping.PropertyMetadataInterface
     */
    export abstract class MemberMetadata extends mix(GenericMetadata, PropertyMetadataInterface) {
        private _class: string;
        private _name: string;
        private _property: string;
        private _reflMember: Record<string | symbol, ReflectionMethod | ReflectionProperty | ReflectionField>;

        /**
         * @param {string} klass The name of the class this member is defined on
         * @param {string} name The name of the member
         * @param {string} property The property the member belongs to
         */
        __construct(klass: string, name: string, property: string): void;
        constructor(klass: string, name: string, property: string);

        /**
         * @inheritdoc
         */
        addConstraint(constraint: Constraint): this;

        /**
         * @inheritdoc
         */
        __sleep(): string[];

        /**
         * Returns the name of the member.
         */
        public readonly name: string;

        /**
         * @inheritdoc
         */
        public readonly className: string;

        /**
         * @inheritdoc
         */
        public readonly propertyName: string;

        /**
         * Returns whether this member is public.
         *
         * @param objectOrClassName The object or the class name
         */
        isPublic(objectOrClassName: object | string): boolean;

        /**
         * Returns whether this member is private.
         *
         * @param objectOrClassName The object or the class name
         */
        isPrivate(objectOrClassName: object | string): boolean;

        /**
         * Returns the reflection instance for accessing the member's value.
         *
         * @param objectOrClassName The object or the class name
         *
         * @returns The reflection instance
         */
        getReflectionMember(objectOrClassName: object | string): ReflectionMethod | ReflectionProperty | ReflectionField;

        /**
         * Creates a new reflection instance for accessing the member's value.
         * Must be implemented by subclasses.
         *
         * @param objectOrClassName The object or the class name
         *
         * @returns The reflection instance
         */
        protected abstract _newReflectionMember(objectOrClassName: object | string): ReflectionMethod | ReflectionProperty | ReflectionField;
    }
}
