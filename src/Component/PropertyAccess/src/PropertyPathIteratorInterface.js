/**
 * @memberOf Jymfony.Component.PropertyAccess
 */
class PropertyPathIteratorInterface {
    /**
     * @inheritdoc
     */
    next(value) { }

    /**
     * Returns whether the current element in the property path is an array
     * index.
     *
     * @returns {boolean}
     */
    isIndex() { }

    /**
     * Returns whether the current element in the property path is a property
     * name.
     *
     * @returns {boolean}
     */
    isProperty() { }
}

export default getInterface(PropertyPathIteratorInterface);
