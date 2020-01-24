const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * Represents a collection of values to lazily iterate over.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Argument
 */
class ReferenceSetArgumentTrait {
    /**
     * @inheritdoc
     */
    get values() {
        return this._values;
    }

    /**
     * @inheritdoc
     */
    set values(values) {
        if (! isArray(values) && ! isObjectLiteral(values)) {
            values = Array.from(values);
        }

        for (const v of Object.values(values)) {
            if (v && ! (v instanceof Reference)) {
                throw new InvalidArgumentException(__jymfony.sprintf('An IteratorArgument must hold only Reference instances, "%s" given.', isObject(v) ? ReflectionClass.getClassName(v) : typeof v));
            }
        }

        this._values = values;
    }
}

export default getTrait(ReferenceSetArgumentTrait);
