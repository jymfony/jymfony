const ArgumentInterface = Jymfony.Component.EventDispatcher.ArgumentInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ServiceClousureArgument extends implementationOf(ArgumentInterface) {

    /**
     * @param {Jymfony.Component.DependencyInjection.Reference} reference
     * @private
     */
    __construct(reference) {
        this._values = [ reference ];
    }

    /**
     *
     * @return {Array|*}
     */
    get values() {
        return this._values;
    }

    /**
     *
     * @param {Array|*} values
     */
    set values(values) {
        if (values[0] === undefined || ! (values[0] instanceof Reference || null === values[0])) {
            throw new InvalidArgumentException('A ServiceClosureArgument must hold one and only one Reference.');
        }

        this._values = values;
    }
}

module.exports = ServiceClousureArgument;
