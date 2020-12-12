const Assert = Jymfony.Component.Testing.Framework.Assert;
const SkipException = Jymfony.Component.Testing.Framework.Exception.SkipException;

/**
 * @memberOf Jymfony.Component.Testing.Framework
 */
export default class TestResult {
    __construct() {
        /**
         * @type {Error | null}
         *
         * @private
         */
        this._failure = null;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._skipped = false;
    }

    async run(test) {
        Assert.resetCount();

        try {
            return await test.runBare();
        } catch (e) {
            if (e instanceof SkipException) {
                this._skipped = true;
            } else {
                this._failure = e;
            }
        }

        return null;
    }

    get failure() {
        return this._failure;
    }

    get skipped() {
        return this._skipped;
    }
}
