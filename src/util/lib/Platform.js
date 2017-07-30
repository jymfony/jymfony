global.__jymfony = global.__jymfony || {};

/**
 * @memberOf __jymfony
 */
class Platform {
    /**
     * Checks if this node version has async function support.
     *
     * @returns {boolean}
     */
    static hasAsyncFunctionSupport() {
        if (undefined === this._asyncSupport) {
            this._asyncSupport = false;

            try {
                let fn;
                eval('fn = async function () { }');
                this._asyncSupport = 'AsyncFunction' === (fn.constructor.name || fn.constructor.displayName);
            } catch (e) {
                if (!(e instanceof SyntaxError)) {
                    throw e;
                }
            }
        }

        return this._asyncSupport;
    }

    /**
     * Are we running on windows?
     *
     * @returns {boolean}
     */
    static isWindows() {
        return 'win32' === process.platform;
    }
}

global.__jymfony.Platform = Platform;
