const HandlerFailedException = Jymfony.Component.Messenger.Exception.HandlerFailedException;
const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

/**
 * Stamp applied when a messages fails due to an exception in the handler.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class ErrorDetailsStamp extends implementationOf(StampInterface) {
    /**
     * Constructor.
     *
     * @param {string} exceptionClass
     * @param {int | string} exceptionCode
     * @param {string} exceptionMessage
     * @param {Jymfony.Component.Debug.Exception.FlattenException | null} [flattenException = null]
     */
    __construct(exceptionClass, exceptionCode, exceptionMessage, flattenException = null) {
        /**
         * @type {string}
         *
         * @private
         */
        this._exceptionClass = exceptionClass;

        /**
         * @type {int | string}
         *
         * @private
         */
        this._exceptionCode = exceptionCode;

        /**
         * @type {string}
         *
         * @private
         */
        this._exceptionMessage = exceptionMessage;

        /**
         * @type {Jymfony.Component.Debug.Exception.FlattenException|null}
         *
         * @private
         */
        this._flattenException = flattenException;
    }

    /**
     * @param {Error} throwable
     *
     * @returns {Jymfony.Component.Messenger.Stamp.ErrorDetailsStamp}
     */
    static create(throwable) {
        if (throwable instanceof HandlerFailedException) {
            throwable = throwable.previous;
        }

        let flattenException = null;
        if (ReflectionClass.exists('Jymfony.Component.Debug.Exception.FlattenException')) {
            flattenException = Jymfony.Component.Debug.Exception.FlattenException.create(throwable);
        }

        return new __self(ReflectionClass.getClassName(throwable), throwable.code || 0, throwable.message, flattenException);
    }

    /**
     * @returns {string}
     */
    get exceptionClass() {
        return this._exceptionClass;
    }

    /**
     * @returns {int | string}
     */
    get exceptionCode() {
        return this._exceptionCode;
    }

    /**
     * @returns {string}
     */
    get exceptionMessage() {
        return this._exceptionMessage;
    }

    /**
     * @returns {Jymfony.Component.Debug.Exception.FlattenException | null}
     */
    get flattenException() {
        return this._flattenException;
    }

    /**
     * @param {Jymfony.Component.Messenger.Stamp.ErrorDetailsStamp} that
     *
     * @returns {boolean}
     */
    equals(that) {
        if (null === that || undefined === that) {
            return false;
        }

        if (this._flattenException && that._flattenException) {
            return this._flattenException.class === that._flattenException.class
                && this._flattenException.code === that._flattenException.code
                && this._flattenException.message === that._flattenException.message;
        }

        return this._exceptionClass === that._exceptionClass
            && this._exceptionCode === that._exceptionCode
            && this._exceptionMessage === that._exceptionMessage;
    }
}
