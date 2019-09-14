/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures
 */
export default class FooClass {
    __construct(args = {}) {
        this.foo = undefined;
        this.moo = undefined;

        this.bar = null;
        this.initialized = false;
        this.configured = false;
        this.called = false;
        this.arguments = args;
    }

    static getInstance(args = []) {
        const obj = new __self(args);
        obj.called = true;

        return obj;
    }

    initialize() {
        this.initialized = true;
    }

    configure() {
        this.configured = true;
    }

    setBar(value = null) {
        this.bar = value;
    }
}
