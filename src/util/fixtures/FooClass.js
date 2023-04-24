class FooClass {
    constructor() {
        this.a = 'hello';
        this.b = 'nodejs';
        this.c = 'world';
        this.d = '!';
        this.sleepCalled = false;
        this.wakeupCalled = false;
    }

    __sleep() {
        this.sleepCalled = true;

        return [ 'a', 'c' ];
    }

    __wakeup() {
        this.wakeupCalled = true;
    }
}

module.exports = FooClass;
