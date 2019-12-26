const AbstractProcessorLoader = Jymfony.Component.Metadata.Loader.AbstractProcessorLoader;

export default class MetadataProcessorLoader extends AbstractProcessorLoader {
    /**
     * @inheritdoc
     */
    _getClassDescriptors(reflectionClass) {
        return [ ...this._getMetadataFromReflection(reflectionClass) ];
    }

    /**
     * @inheritdoc
     */
    _getFieldDescriptors(reflectionField) {
        return [ ...this._getMetadataFromReflection(reflectionField) ];
    }

    /**
     * @inheritdoc
     */
    _getMethodDescriptors(reflectionMethod) {
        return [ ...this._getMetadataFromReflection(reflectionMethod) ];
    }

    /**
     * @inheritdoc
     */
    _getPropertyDescriptors(readable, writable) {
        return [ ...this._getMetadataFromReflection(readable), ...this._getMetadataFromReflection(writable) ];
    }

    /**
     * Yields the metadata objects from reflection.
     *
     * @param {ReflectionClass|ReflectionField|ReflectionMethod|ReflectionProperty} subject
     *
     * @returns {Generator<*>}
     *
     * @private
     */
    * _getMetadataFromReflection(subject) {
        for (const [ key, value ] of subject.metadata) {
            if (isFunction(key) && value instanceof key) {
                yield value;
            }
        }
    }
}
