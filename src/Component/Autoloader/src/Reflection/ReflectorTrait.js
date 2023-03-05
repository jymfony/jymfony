class ReflectorTrait {
    /**
     * Gets the annotation instances of the given class.
     *
     * @param {Function | string} class_
     * @param {boolean} subclass
     *
     * @returns {Object[]}
     */
    getAnnotations(class_, subclass = false) {
        const annotationReflClass = new ReflectionClass(class_);
        const annotationClass = annotationReflClass.getConstructor();

        return this.metadata
            .filter(([ klass ]) => {
                if (klass === annotationClass) {
                    return true;
                }

                return subclass && new ReflectionClass(klass).isSubclassOf(annotationClass);
            })
            .map(m => m[1])
            .flat();
    }
}

module.exports = getTrait(ReflectorTrait);
