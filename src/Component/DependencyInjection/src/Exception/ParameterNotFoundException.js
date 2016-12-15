const InvalidArgumentException = Jymfony.DependencyInjection.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.DependencyInjection.Exception
 */
module.exports = class ParameterNotFoundException extends InvalidArgumentException {
    constructor(key, sourceId, sourceKey) {
        super('');

        this._key = key;
        this._sourceId = sourceId;
        this._sourceKey = sourceKey;

        this._updateMsg();
    }

    _updateMsg() {
        if (null !== this._sourceId) {
            this.message = `The service "${this._sourceId}" has a dependency on a non-existent parameter "${this._key}".`;
        } else if (null !== this._sourceKey) {
            this.message = `The parameter "${this._sourceKey}" has a dependency on a non-existent parameter "${this._key}".`;
        } else {
            this.message = `You have requested a non-existent parameter "${this._key}".`;
        }
    }

    set sourceKey(sourceKey) {
        this._sourceKey = sourceKey;
        this._updateMsg();
    }

    set sourceId(sourceId) {
        this._sourceId = sourceId;
        this._updateMsg();
    }
};
