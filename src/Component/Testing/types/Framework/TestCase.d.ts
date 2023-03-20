declare namespace Jymfony.Component.Testing.Framework {
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    interface TestCaseContext {
        currentTest: string;
    }

    export class TestCase extends Assert {
        protected _context: Partial<TestCaseContext>;
        private _expectedException: undefined | ReflectionClass;
        private _expectedExceptionMessage: undefined | string;
        private _expectedExceptionMessageRegex: undefined | RegExp;

        /**
         * Run test case.
         * Not to be called directly, will be called by the test runner.
         *
         * @internal
         */
        runTestCase(mocha: any): void;

        /**
         * Creates new object prophecy.
         */
        prophesize<T extends object>(classOrInterface?: Newable<T>): ObjectProphecy<T> & Prophecy<T>;
        prophesize<T = any>(classOrInterface?: string): ObjectProphecy<T> & Prophecy<T>;
        prophesize<T = any>(classOrInterface?: undefined): ObjectProphecy<T>;

        /**
         * Performs assertions shared by all tests of a test case.
         *
         * This method is called between beforeEach() and test.
         */
        protected assertPreConditions(): void;

        /**
         * Performs assertions shared by all tests of a test case.
         *
         * This method is called between test run and before afterEach().
         */
        protected assertPostConditions(): void;

        /**
         * Extend this method to execute preliminary/preparation work
         * before the execution of current test case.
         */
        before(): void;

        /**
         * Extend this method to execute cleanup work after the execution of current test case.
         */
        after(): void;

        /**
         * Extend this method to execute preliminary/preparation work
         * before each test of current test case.
         */
        protected beforeEach(): void | Promise<void>;

        /**
         * Extends this method to execute cleanup work after each test
         * of the current test class.
         */
        protected afterEach(): void | Promise<void>;

        public readonly testCaseName: string;

        /**
         * Override this to set a default timeout for all the tests of this test case.
         */
        public readonly defaultTimeout: undefined | number;

        /**
         * Override this to set the retry count for flaky tests.
         */
        public readonly retries: undefined | number;

        /**
         * Sets the timeout for the currently running test.
         */
        setTimeout(ms: number): void;

        /**
         * Sets the title for the currently running test.
         */
        setTitle(title: string): void;

        /**
         * Register an exception to be expected.
         * The test will pass only if an exception of the given class (or one of its subclasses)
         * has been thrown while executing the test.
         */
        expectException(exception: string | Newable): void;

        /**
         * Register an exception message to be expected.
         * The test will pass only if an exception is thrown and its message is *EXACTLY* equals
         * to the one given to this method.
         */
        expectExceptionMessage(message: string): void;

        /**
         * Register an exception message regex to be expected.
         * The test will pass only if an exception is thrown and its message is matching
         * to the regex passed to this method.
         */
        expectExceptionMessageRegex(message: string | RegExp): void;

        /**
         * Marks current test as skipped and stops execution.
         */
        markTestSkipped(): never;

        /**
         * Marks current test as skipped and stops execution.
         */
        static markTestSkipped(): never;

        /**
         * Checks if the catched exception is the expected one.
         */
        private _checkExpectedException(exception: Error): boolean;
    }
}
