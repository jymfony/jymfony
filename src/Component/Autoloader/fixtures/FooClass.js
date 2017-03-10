const BarClass = Foo.BarClass;

class FooClass {
    constructor() {
        this.bar = new BarClass(this);
    }
}

FooClass.HELLO = 'Hello, world!';

module.exports = FooClass;
