let kTimerHandle = 0;

/**
 * @memberOf Jymfony.Component.Testing.Framework.TimeSensitive
 */
export default class Timer {
    __construct(handler) {
        this._handler = handler;
        this._ref = true;
        this._handle = ++kTimerHandle;
    }

    ref() {
        this._ref = true;
    }

    unref() {
        this._ref = false;
    }

    hasRef() {
        return this._ref;
    }

    refresh() {
    }

    [Symbol.toPrimitive]() {
        return this._handle;
    }
}
