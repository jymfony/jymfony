import Suite from 'mocha/lib/suite';
import Test from 'mocha/lib/test';

const Assert = Jymfony.Component.Testing.Framework.Assert;
const AfterEach = Jymfony.Component.Testing.Annotation.AfterEach;
const BeforeEach = Jymfony.Component.Testing.Annotation.BeforeEach;
const DataProvider = Jymfony.Component.Testing.Annotation.DataProvider;
const Prophet = Jymfony.Component.Testing.Prophet;
const SkipException = Jymfony.Component.Testing.Framework.Exception.SkipException;
const TestResult = Jymfony.Component.Testing.Framework.TestResult;
const TimeSensitive = Jymfony.Component.Testing.Annotation.TimeSensitive;

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
export default class TestCase extends Assert {
    __construct() {
        /**
         * @type {Object.<string, *>}
         *
         * @protected
         */
        this._context = {};

        /**
         * @type {int}
         *
         * @private
         */
        this._numAssertions = 0;

        /**
         * @type {*}
         *
         * @private
         */
        this._testResult = undefined;

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

        /**
         * @type {undefined | boolean}
         *
         * @private
         */
        this._doesNotPerformAssertions = undefined;

        this._afterEachHooks = [];
        this._beforeEachHooks = [];

        const reflectionClass = new ReflectionClass(this);
        for (const method of reflectionClass.methods) {
            const reflectionMethod = reflectionClass.getMethod(method);

            const afterEach = reflectionMethod.getAnnotations(AfterEach);
            const beforeEach = reflectionMethod.getAnnotations(BeforeEach);

            if (0 < afterEach.length) {
                this._afterEachHooks.push(reflectionMethod);
            }

            if (0 < beforeEach.length) {
                this._beforeEachHooks.push(reflectionMethod);
            }
        }
    }

    get length() {
        return 1;
    }

    /**
     * Runs the test case and collects the results in a TestResult object.
     * If no TestResult object is passed a new one will be created.
     *
     * @param {Jymfony.Component.Testing.Framework.TestResult} result
     */
    async run(result = null) {
        if (null === result) {
            result = new TestResult();
        }

        await result.run(this);
        if (null !== result.failure) {
            this._checkExpectedException(result.failure);
            this._numAssertions += Assert.getCount();
        }

        return result;
    }

    async runBare() {
        this._numAssertions = 0;
        await this.runTest();

        return this._testResult;
    }

    async runTest() {
        const verifyMockObjects = () => {
            const prophet = prophets.get(this);
            if (prophet) {
                try {
                    prophet.checkPredictions();
                } finally {
                    prophets.delete(this);
                }
            }
        };

        this.assertPreConditions();
        this._testResult = await this._context.method.invoke(this, ...this._context.args);
        verifyMockObjects();
        this.assertPostConditions();
    }

    /**
     * Override this to set a default timeout for all the tests of this test case.
     *
     * @return {int|undefined}
     */
    get defaultTimeout() {
        return Infinity;
    }

    /**
     * Override this to set the retry count for flaky tests.
     *
     * @returns {int|undefined}
     */
    get retries() {
        return undefined;
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
            const execution = async function (reflectionMethod, args = []) {
                try {
                    await reflectionMethod.invoke(self, ...args);
                } catch (e) {
                    if (e instanceof SkipException) {
                        this.skip();
                    } else {
                        throw e;
                    }
                }
            };

            const before = async function () {
                self._expectedException = undefined;
                self._expectedExceptionMessage = undefined;
                self._expectedExceptionMessageRegex = undefined;
                self._doesNotPerformAssertions = undefined;
                prophets.delete(self);

                const defaultTimeout = self.defaultTimeout;
                if (defaultTimeout) {
                    this.timeout(defaultTimeout);
                }

                const retries = self.retries;
                if (1 < retries) {
                    this.retries(retries);
                }

                for (const hook of self._beforeEachHooks) {
                    await hook.invoke(self);
                }

                return execution.call(this, reflectionClass.getMethod('beforeEach'));
            };

            this.beforeAll(function () {
                this.timeout(30000);

                return execution.call(this, reflectionClass.getMethod('before'));
            });

            this.afterAll(function () {
                this.timeout(30000);

                return self.after.call(self);
            });

            this.beforeEach(before);
            this.afterEach(async function () {
                for (const hook of self._afterEachHooks) {
                    await hook.invoke(self);
                }

                return execution.call(this, reflectionClass.getMethod('afterEach'));
            });

            for (const method of reflectionClass.methods) {
                if (! method.startsWith('test')) {
                    continue;
                }

                const reflectionMethod = reflectionClass.getMethod(method);
                const testName = method.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);
                const providers = reflectionMethod.getAnnotations(DataProvider);
                const data = providers.length ? providers.map(provider => [ ...reflectionClass.getMethod(provider.provider).invoke(self) ]).flat() : undefined;

                let timeSensitive = 0 < reflectionMethod.getAnnotations(TimeSensitive).length;
                let kl = reflectionClass;
                do {
                    timeSensitive = timeSensitive || 0 < kl.getAnnotations(TimeSensitive).length;
                    if (timeSensitive) {
                        break;
                    }
                } while ((kl = kl.getParentClass()));

                const runTest = args => {
                    return async function() {
                        if (timeSensitive) {
                            Jymfony.Component.Testing.Framework.TimeSensitive.TimeSensitive.install(this);
                        }

                        self._context = {
                            method: reflectionMethod,
                            args,
                            currentTest: reflectionMethod.name,
                            setTimeout: this.timeout.bind(this),
                            setTitle: newTitle => this._runnable.title = newTitle,
                        };

                        const defaultTimeout = self.defaultTimeout;
                        if (defaultTimeout) {
                            this.timeout(defaultTimeout);
                        }

                        try {
                            await self.run();
                        } finally {
                            if (timeSensitive) {
                                Jymfony.Component.Testing.Framework.TimeSensitive.TimeSensitive.uninstall(this);
                            }
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
     * Sets the title for the currently running test.
     *
     * @param title
     */
    setTitle(title) {
        if (this._context) {
            this._context.setTitle(title);
        }
    }

    /**
     * Register an exception to be expected.
     * The test will pass only if an exception of the given class (or one of its subclasses)
     * has been thrown while executing the test.
     *
     * @param {string | Function | ErrorConstructor} exception
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

        this._expectedExceptionMessageRegex = message;
    }

    expectNotToPerformAssertions() {
        this._doesNotPerformAssertions = true;
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
            Assert.assertInstanceOf(this._expectedException.getConstructor(), exception);
        }

        if (this._expectedExceptionMessage !== undefined) {
            Assert.assertEquals(this._expectedExceptionMessage, exception.message);
        }

        if (this._expectedExceptionMessageRegex !== undefined) {
            Assert.assertMatchesRegularExpression(this._expectedExceptionMessageRegex, exception.message);
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
