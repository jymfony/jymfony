const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const NotFoundExceptionInterface = Jymfony.Component.DependencyInjection.Exception.NotFoundExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class ParameterNotFoundException extends mix(InvalidArgumentException, NotFoundExceptionInterface) {
    /**
     * @inheritdoc
     */
    __construct(key, sourceId = undefined, sourceKey = undefined) {
        super.__construct('');

        this._key = key;
        this._sourceId = sourceId;
        this._sourceKey = sourceKey;

        this._updateMsg();
    }

    /**
     * @private
     */
    _updateMsg() {
        if (undefined !== this._sourceId) {
            this.message = `The service "${this._sourceId}" has a dependency on a non-existent parameter "${this._key}".`;
        } else if (undefined !== this._sourceKey) {
            this.message = `The parameter "${this._sourceKey}" has a dependency on a non-existent parameter "${this._key}".`;
        } else {
            this.message = `You have requested a non-existent parameter "${this._key}".`;
        }
    }

    /**
     * @param {string} sourceKey
     */
    set sourceKey(sourceKey) {
        this._sourceKey = sourceKey;
        this._updateMsg();
    }

    /**
     * @param {string} sourceId
     */
    set sourceId(sourceId) {
        this._sourceId = sourceId;
        this._updateMsg();
    }
}

module.exports = ParameterNotFoundException;
