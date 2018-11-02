const StreamWrapperNotAvailableException = Jymfony.Component.Filesystem.Exception.StreamWrapperNotAvailableException;
const StreamWrapperInterface = Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface;

const parse = require('url').parse;
let singleton;

/**
 * StreamWrapper registry.
 *
 * @final
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper
 */
class StreamWrapper {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Object.<string, Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface>}
         *
         * @private
         */
        this._wrappers = {
            file: new Jymfony.Component.Filesystem.StreamWrapper.FileStreamWrapper(),
            http: new Jymfony.Component.Filesystem.StreamWrapper.HttpStreamWrapper(),
            https: new Jymfony.Component.Filesystem.StreamWrapper.HttpsStreamWrapper(),
        };
    }

    /**
     * Gets the appropriate stream wrapper for the given URL.
     *
     * @param {string} path
     *
     * @returns {Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.StreamWrapperNotAvailableException}
     */
    static get(path) {
        return StreamWrapper.getInstance().get(path);
    }

    /**
     * Gets the appropriate stream wrapper for the given URL.
     *
     * @param {string} path
     *
     * @returns {Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.StreamWrapperNotAvailableException}
     */
    get(path) {
        if (path.match(/^[a-z]:[\/\\]/i, path)) {
            return this._wrappers['file'];
        }

        const url = parse(path);
        if (! url.protocol) {
            return this._wrappers['file'];
        }

        const proto = __jymfony.rtrim(url.protocol.toString(), ':');
        if (this._wrappers[proto]) {
            return this._wrappers[proto];
        }

        throw new StreamWrapperNotAvailableException(proto);
    }

    /**
     * Registers a stream wrapper into the registry.
     *
     * @param {Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface} wrapper
     */
    static register(wrapper) {
        StreamWrapper.getInstance().register(wrapper);
    }

    /**
     * Registers a stream wrapper into the registry.
     *
     * @param {Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface} wrapper
     */
    register(wrapper) {
        if (! (wrapper instanceof StreamWrapperInterface)) {
            throw new TypeError(__jymfony.sprintf(
                'Argument 1 passed to StreamWrapper.register must be an instance of ' +
                'StreamWrapperInterface, %s passed',
                isScalar(wrapper) || isObjectLiteral(wrapper) ? typeof wrapper : ReflectionClass.getClassName(wrapper)
            ));
        }

        this._wrappers[wrapper.protocol] = wrapper;
    }

    /**
     * Gets the singleton instance.
     *
     * @returns {Jymfony.Component.Filesystem.StreamWrapper.StreamWrapper}
     */
    static getInstance() {
        if (undefined === singleton) {
            singleton = new __self();
        }

        return singleton;
    }
}

module.exports = StreamWrapper;
