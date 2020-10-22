import { DataProvider } from '@jymfony/decorators';
import Suite from 'mocha/lib/suite';
import Test from 'mocha/lib/test';
import { expect } from 'chai';

const Prophet = Jymfony.Component.Testing.Prophet;
const SkipException = Jymfony.Component.Testing.Framework.Exception.SkipException;

const prophets = new WeakMap();
const getProphet = obj => {
    if (! prophets.has(obj)) {
        prophets.set(obj, new Prophet());
    }

    return prophets.get(obj);
};

/**
 * @memberOf Jymfony.Component.Testing.Framework
 */
export default class TestCase {
    __construct() {
        /**
         * @type {Object.<string, *>}
         *
         * @protected
         */
        this._context = {};

        /**
         * @type {undefined | ReflectionClass}
         *
         * @private
         */
        this._expectedException = undefined;

        /**
         * @type {undefined | string}
         *
         * @private
         */
        this._expectedExceptionMessage = undefined;

        /**
         * @type {undefined | RegExp}
         *
         * @private
         */
        this._expectedExceptionMessageRegex = undefined;
    }

    /**
     * Run test case.
     * Not to be called directly, will be called by the test runner.
     *
     * @param {Mocha} mocha
     *
     * @internal
     */
    runTestCase(mocha) {
        const reflectionClass = new ReflectionClass(this);

        const suite = new Suite(this.testCaseName, mocha.suite.ctx, false);
        (function (self) {
            const execution = function (reflectionMethod, args) {
                return async function () {
                    try {
                        return await reflectionMethod.invoke(self, ...args);
                    } catch (e) {
                        if (e instanceof SkipException) {
                            this.skip();
                        } else {
                            throw e;
                        }
                    }
                };
            };

            const verifyMockObjects = () => {
                const prophet = prophets.get(self);
                if (prophet) {
                    try {
                        prophet.checkPredictions();
                    } finally {
                        prophets.delete(self);
                    }
                }
            };

            const before = function () {
                self._expectedException = undefined;
                self._expectedExceptionMessage = undefined;
                self._expectedExceptionMessageRegex = undefined;

                const exec = execution(reflectionClass.getMethod('beforeEach'), []);
                prophets.delete(self);

                return exec.call(this);
            };

            this.beforeAll(async function () {
                try {
                    await self.before();
                } catch (e) {
                    if (e instanceof SkipException) {
                        this.skip();
                    } else {
                        throw e;
                    }
                }
            });

            this.afterAll(self.after.bind(null));
            this.beforeEach(before);
            this.afterEach(execution(reflectionClass.getMethod('afterEach'), []));

            for (const method of reflectionClass.methods) {
                if (! method.startsWith('test')) {
                    continue;
                }

                const reflectionMethod = reflectionClass.getMethod(method);
                const testName = method.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);
                const providers = reflectionMethod.metadata.filter(([ klass ]) => klass === DataProvider).map(a => a[1]);
                const data = providers.length ? providers.map(provider => [ ...reflectionClass.getMethod(provider.provider).invoke(self) ]).flat() : undefined;

                const runTest = args => {
                    const exec = execution(reflectionMethod, args);
                    const doExec = async (this_) => {
                        let exception;
                        try {
                            await exec.call(this_);
                        } catch (e) {
                            exception = e;
                        }

                        if (undefined !== exception) {
                            self._checkExpectedException(exception);
                        }
                    };

                    return async function() {
                        self._context = {
                            currentTest: reflectionMethod.name,
                            setTimeout: this.timeout.bind(this),
                        };

                        try {
                            self.assertPreConditions();

                            await doExec(this);

                            verifyMockObjects();
                            self.assertPostConditions();
                        } finally {
                            self._context = {};
                        }
                    };
                };

                if (undefined !== data) {
                    let i = 0;
                    for (const args of data) {
                        this.addTest(new Test(testName + ' #' + ++i, runTest(args)));
                    }
                } else {
                    this.addTest(new Test(testName, runTest([])));
                }
            }
        }).call(suite, this);

        mocha.suite.addSuite(suite);
    }

    /**
     * Creates new object prophecy.
     *
     * @param {undefined|string} classOrInterface
     *
     * @returns {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     */
    prophesize(classOrInterface) {
        const prophet = getProphet(this);

        return prophet.prophesize(classOrInterface);
    }

    /**
     * Performs assertions shared by all tests of a test case.
     *
     * This method is called between beforeEach() and test.
     */
    assertPreConditions() {
        // Do nothing
    }

    /**
     * Performs assertions shared by all tests of a test case.
     *
     * This method is called between test run and before afterEach().
     */
    assertPostConditions() {
        // Do nothing
    }

    /**
     * Extend this method to execute preliminary/preparation work
     * before the execution of current test case.
     */
    before() {
        // Do nothing
    }

    /**
     * Extend this method to execute cleanup work after the execution of current test case.
     */
    after() {
        // Do nothing
    }

    /**
     * Extend this method to execute preliminary/preparation work
     * before each test of current test case.
     */
    beforeEach() {
        // Do nothing
    }

    /**
     * Extends this method to execute cleanup work after each test
     * of the current test class.
     */
    afterEach() {
        // Do nothing
    }

    get testCaseName() {
        return String(this.constructor.name).replace(/Test$/, '');
    }

    /**
     * Sets the timeout for the currently running test.
     *
     * @param {number} ms
     */
    setTimeout(ms) {
        if (this._context) {
            this._context.setTimeout(ms);
        }
    }

    /**
     * Register an exception to be expected.
     * The test will pass only if an exception of the given class (or one of its subclasses)
     * has been thrown while executing the test.
     *
     * @param {string | Function} exception
     */
    expectException(exception) {
        this._expectedException = new ReflectionClass(exception);
    }

    /**
     * Register an exception message to be expected.
     * The test will pass only if an exception is thrown and its message is *EXACTLY* equals
     * to the one given to this method.
     *
     * @param {string} message
     */
    expectExceptionMessage(message) {
        if (! isString(message)) {
            throw new InvalidArgumentException('Argument #1 passed to expectedExceptionMessage must be a string');
        }

        this._expectedExceptionMessage = message;
    }

    /**
     * Register an exception message regex to be expected.
     * The test will pass only if an exception is thrown and its message is matching
     * to the regex passed to this method.
     */
    expectExceptionMessageRegex(message) {
        if (isString(message)) {
            message = new RegExp(message);
        }

        if (! isRegExp(message)) {
            throw new InvalidArgumentException('Argument #1 passed to expectedExceptionMessageRegex must be a string or a RegExp object');
        }
    }

    /**
     * Marks current test as skipped and stops execution.
     */
    markTestSkipped() {
        __self.markTestSkipped();
    }

    /**
     * Marks current test as skipped and stops execution.
     */
    static markTestSkipped() {
        throw new SkipException();
    }

    /**
     * Checks if the catched exception is the expected one.
     *
     * @param {Error} exception
     *
     * @returns {boolean}
     *
     * @private
     */
    _checkExpectedException(exception) {
        if (exception instanceof Jymfony.Component.Testing.Framework.Exception.Exception) {
            throw exception;
        }

        if (this._expectedException !== undefined) {
            expect(exception).to.be.instanceOf(this._expectedException.getConstructor());
        }

        if (this._expectedExceptionMessage !== undefined) {
            expect(exception.message).to.be.equal(this._expectedExceptionMessage);
        }

        if (this._expectedExceptionMessageRegex !== undefined) {
            expect(exception.message).to.match(this._expectedExceptionMessageRegex);
        }

        if (
            this._expectedException === undefined &&
            this._expectedExceptionMessage === undefined &&
            this._expectedExceptionMessageRegex === undefined
        ) {
            throw exception;
        }
    }
}
