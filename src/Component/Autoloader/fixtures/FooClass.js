const BarClass = Foo.BarClass;

class FooClass {
    __construct() {
        this.bar = new BarClass(this);
    }
}

FooClass.HELLO = 'Hello, world!';

module.exports = FooClass;
