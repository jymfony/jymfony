declare namespace Jymfony.Component.Metadata.Loader {
    export class MetadataProcessorLoader extends AbstractProcessorLoader {
        /**
         * @inheritdoc
         */
        protected _getClassDescriptors(reflectionClass: ReflectionClass): IterableIterator<any> | any[];

        /**
         * @inheritdoc
         */
        protected _getMethodDescriptors(reflectionMethod: ReflectionMethod): IterableIterator<any> | any[];

        /**
         * @inheritdoc
         */
        protected _getPropertyDescriptors(readable: ReflectionProperty, writable: ReflectionProperty): IterableIterator<any> | any[];

        /**
         * @inheritdoc
         */
        protected _getFieldDescriptors(reflectionField: ReflectionField): IterableIterator<any> | any[];

        /**
         * Yields the metadata objects from reflection.
         */
        private _getMetadataFromReflection(subject: ReflectionClass | ReflectionMethod | ReflectionField | ReflectionProperty): Generator<any>;
    }
}
