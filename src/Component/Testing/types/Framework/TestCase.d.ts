declare namespace Jymfony.Component.Testing.Framework {
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class TestCase {
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

        get dataProviders(): Record<string, string>;

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
        protected beforeEach(): void;

        /**
         * Extends this method to execute cleanup work after each test
         * of the current test class.
         */
        protected afterEach(): void;

        public readonly testCaseName: string;

        markTestSkipped(): never;
    }
}
