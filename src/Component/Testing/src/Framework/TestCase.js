import { DataProvider } from '@jymfony/decorators';
import Suite from 'mocha/lib/suite';
import Test from 'mocha/lib/test';

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
    /**
     * Run test case.
     * Not to be called directly, will be called by the test runner.
     *
     * @param {Mocha} mocha
     *
     * @internal
     */
    runTestCase(mocha) {
        const self = this;
        const reflectionClass = new ReflectionClass(this);

        const suite = new Suite(this.testCaseName, mocha.suite.ctx, false);
        (function () {
            const execution = function (reflectionMethod, args) {
                return function () {
                    try {
                        return reflectionMethod.invoke(self, ...args);
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
                const exec = execution(reflectionClass.getMethod('beforeEach'), []);
                this._prophet = null;

                return exec.call(this);
            };

            this.beforeAll(self.before.bind(null));
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

                    return async function() {
                        self.assertPreConditions();

                        await exec.call(this);

                        verifyMockObjects();
                        self.assertPostConditions();
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
        }).call(suite);

        mocha.suite.addSuite(suite);
    }

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

    markTestSkipped() {
        throw new SkipException();
    }
}
