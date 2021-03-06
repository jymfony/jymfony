const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Argument
 */
export default class ServiceClosureArgument extends implementationOf(ArgumentInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.Reference} reference
     */
    __construct(reference) {
        this._values = [ reference ];
    }

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
        if (1 === values.length && ! (undefined === values[0] || null === values[0] || values[0] instanceof Reference)) {
            throw new InvalidArgumentException('A ServiceClosureArgument must hold one and only one Reference.');
        }

        this._values = values;
    }
}
