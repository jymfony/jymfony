global.__jymfony = global.__jymfony || {};

/**
 * @memberOf __jymfony
 */
class Platform {
    static hasAsyncFunctionSupport() {
        if (undefined === this._asyncSupport) {
            this._asyncSupport = false;

            try {
                let fn;
                eval('fn = async function () { }');
                this._asyncSupport = (fn.constructor.name || fn.constructor.displayName) === 'AsyncFunction';
            } catch (e) {
                if (!(e instanceof SyntaxError)) {
                    throw e;
                }
            }
        }

        return this._asyncSupport;
    }
}

global.__jymfony.Platform = Platform;
