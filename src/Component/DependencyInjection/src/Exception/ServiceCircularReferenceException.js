const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
module.exports = class ServiceCircularReferenceException extends RuntimeException {
    constructor(id, path) {
        super('');

        let params = Array.from(path);
        this.message = `Circular reference detected for service "${id}", path: "${params.join('" -> "')}".`;

        this._serviceId = id;
        this._path = params;
    }

    get serviceId() {
        return this._serviceId;
    }

    get path() {
        return this._path;
    }
};
