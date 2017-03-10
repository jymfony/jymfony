const FooClass = Foo.FooClass;

module.exports = class BarClass {
    constructor(fooClass) {
        this.fooClass = fooClass;
    }

    test() {
        return FooClass.HELLO;
    }
};
