declare namespace Jymfony.Component.Validator.Mapping {
    import BaseNullMetadata = Jymfony.Contracts.Metadata.NullMetadata;
    import Constraint = Jymfony.Component.Validator.Constraint;
    import PropertyMetadataInterface = Jymfony.Component.Validator.Mapping.PropertyMetadataInterface;

    export class NullMetadata extends mix(BaseNullMetadata, PropertyMetadataInterface) {
        private _class: string;
        private _property: string;

        /**
         * Constructor.
         *
         * @param klass The name of the class this member is defined on
         * @param name The name of the member
         * @param property The property the member belongs to
         */
        // @ts-ignore
        __construct(klass: string, name: string, property: string): void;
        constructor(klass: string, name: string, property: string);

        /**
         * @inheritdoc
         */
        public readonly className: string;

        /**
         * @inheritdoc
         */
        public readonly propertyName: string;

        /**
         * @inheritdoc
         */
        getPropertyValue(containingValue: any): any;

        /**
         * @inheritdoc
         */
        findConstraints(): Constraint[];
    }
}
