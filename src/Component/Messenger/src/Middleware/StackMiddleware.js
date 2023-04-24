const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const StackInterface = Jymfony.Component.Messenger.Middleware.StackInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class StackMiddleware extends implementationOf(MiddlewareInterface, StackInterface) {
    /**
     * Constructor.
     *
     * @param {Iterable<Jymfony.Component.Messenger.Middleware.MiddlewareInterface>|MiddlewareInterface|null} middlewares
     */
    __construct(middlewares = null) {
        /**
         * @type {MiddlewareStack}
         *
         * @private
         */
        this._stack = new MiddlewareStack();

        /**
         * @type {int}
         *
         * @private
         */
        this._offset = 0;

        if (null === middlewares) {
            return;
        }

        if (isArray(middlewares)) {
            this._stack.iterator = middlewares[Symbol.iterator]();
        } else if (middlewares instanceof MiddlewareInterface) {
            this._stack.stack.push(middlewares);
        } else {
            this._stack.iterator = (function * () {
                yield * middlewares;
            }());
        }
    }

    next() {
        const next = this._stack.next(this._offset);
        if (null === next) {
            return this;
        }

        ++this._offset;

        return next;
    }

    handle(envelope) {
        return envelope;
    }
}

class MiddlewareStack {
    /**
     * @param {Iterator} iterator
     */
    __construct(iterator = null) {
        /**
         * @type {Iterator}
         */
        this.iterator = iterator;

        /**
         * @type {Jymfony.Component.Messenger.Middleware.MiddlewareInterface[]}
         */
        this.stack = [];
    }

    next(offset) {
        if (undefined !== this.stack[offset]) {
            return this.stack[offset];
        }

        if (null === this.iterator) {
            return null;
        }

        const next = this.iterator.next();
        if (next.done) {
            return this.iterator = null;
        }

        this.stack.push(next.value);

        return next.value;
    }
}
