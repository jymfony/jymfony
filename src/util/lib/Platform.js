global.__jymfony = global.__jymfony || {};

let _asyncSupport = undefined;
let _modernRegex = undefined;

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
        if (undefined === _asyncSupport) {
            _asyncSupport = false;

            try {
                let fn;
                eval('fn = async function () { }');
                _asyncSupport = 'AsyncFunction' === (fn.constructor.name || fn.constructor.displayName);
            } catch (e) {
                if (!(e instanceof SyntaxError)) {
                    throw e;
                }
            }
        }

        return _asyncSupport;
    }

    /**
     * Are we running on windows?
     *
     * @returns {boolean}
     */
    static isWindows() {
        return 'win32' === process.platform;
    }

    /**
     * Checks if this node version has modern regex (named groups) support.
     *
     * @returns {boolean}
     */
    static hasModernRegex() {
        if (undefined === _modernRegex) {
            _modernRegex = false;

            try {
                RegExp('(?<test>.+)');
                _modernRegex = true;
            } catch (e) {
                if (!(e instanceof SyntaxError)) {
                    throw e;
                }
            }
        }

        return _modernRegex;
    }
}

__jymfony.Platform = Platform;
