const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class ParameterCircularReferenceException extends RuntimeException {
    /**
     * @inheritdoc
     */
    __construct(parameters) {
        const params = Array.from(parameters);

        super.__construct(`Circular reference detected for parameter "${params[0]}" ("${params.join('" > "')}" > "${params[0]}")`);
    }
}

module.exports = ParameterCircularReferenceException;
