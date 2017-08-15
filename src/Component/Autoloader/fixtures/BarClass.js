const FooClass = Foo.FooClass;

module.exports = class BarClass {
    __construct(fooClass) {
        this.fooClass = fooClass;
    }

    test() {
        return FooClass.HELLO;
    }
};
