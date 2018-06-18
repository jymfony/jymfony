const FooClass = Foo.FooClass;

class BarClass {
    /**
     * Constructor.
     *
     * @param {FooClass} fooClass
     */
    __construct(fooClass) {
        this.fooClass = fooClass;
    }

    test() {
        return FooClass.HELLO;
    }
}

module.exports = BarClass;
