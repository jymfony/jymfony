/**
 * @memberOf Jymfony.Component.Metadata
 */
class MetadataPropertiesTrait {
    /**
     * @see __jymfony.serialize
     *
     * @return {string[]}
     */
    __sleep() {
        return this._getSerializableProperties();
    }

    /**
     * Gets the property names to be serialized.
     * By default returns all the non-private fields not starting with "_"
     * and the readable and writable properties not starting with "_".
     *
     * @returns {string[]}
     */
    _getSerializableProperties() {
        const publicProperties = [];
        const reflectionClass = new ReflectionClass(this);

        for (const field of reflectionClass.fields) {
            if (field.startsWith('_') || field.startsWith('#')) {
                continue;
            }

            publicProperties.push(field);
        }

        for (const prop of reflectionClass.properties) {
            if (prop.startsWith('_') || prop.startsWith('#')) {
                continue;
            }

            if (! reflectionClass.hasReadableProperty(prop) || ! reflectionClass.hasWritableProperty(prop)) {
                continue;
            }

            publicProperties.push(prop);
        }

        return [ ...new Set(publicProperties) ];
    }
}

export default getTrait(MetadataPropertiesTrait);
