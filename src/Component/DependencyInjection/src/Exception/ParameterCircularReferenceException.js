const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
module.exports = class ParameterCircularReferenceException extends RuntimeException {
    constructor(parameters) {
        super('');

        let params = Array.from(parameters);
        this.message = `Circular reference detected for parameter "${params[0]}" ("${params.join('" > "')}" > "${params[0]}")`;
    }
};
