const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class ServiceCircularReferenceException extends RuntimeException {
    /**
     * @inheritdoc
     */
    __construct(id, path) {
        super.__construct('');

        const params = Array.from(path);
        this.message = `Circular reference detected for service "${id}", path: "${params.join('" -> "')}".`;

        this._serviceId = id;
        this._path = params;
    }

    /**
     * @returns {string}
     */
    get serviceId() {
        return this._serviceId;
    }

    /**
     * @returns {string}
     */
    get path() {
        return this._path;
    }
}

module.exports = ServiceCircularReferenceException;
