const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
export default class ParameterCircularReferenceException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {string[]} parameters
     */
    __construct(parameters) {
        const params = Array.from(parameters);

        super.__construct(`Circular reference detected for parameter "${params[0]}" ("${params.join('" > "')}" > "${params[0]}")`);
    }
}
