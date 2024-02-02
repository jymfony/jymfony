class ReflectorInterface {
    /**
     * Gets the class metadata.
     *
     * @returns {[Function, *][]}
     */
    get metadata() { }

    /**
     * Gets the annotation instances of the given class.
     *
     * @param {Function | string} class_
     * @param {boolean} subclass
     *
     * @returns {Object[]}
     */
    getAnnotations(class_, subclass = false) { }
}

module.exports = globalThis.ReflectorInterface = getInterface(ReflectorInterface);
