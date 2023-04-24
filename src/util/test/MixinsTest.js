const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class MixinsTest extends TestCase {
    testShouldThrowPassingUndefinedToMix() {
        this.expectException(LogicException);
        this.expectExceptionMessage('Cannot implement/use undefined as interface/trait. You probably passed a broken reference to mix/implementationOf.');

        // eslint-disable-next-line no-unused-vars
        class Foo extends implementationOf(undefined) { }
    }

    testShouldThrowPassingNonFunctionToMix() {
        this.expectException(LogicException);
        this.expectExceptionMessage('Cannot implement/use string as interface/trait. You probably passed a broken reference to mix/implementationOf.');

        // eslint-disable-next-line no-unused-vars
        class Foo extends implementationOf('foobar') { }
    }

    testShouldReturnAnExtendableExpression() {
        const iTest = getInterface(class TestInterface {});
        __self.assertIsFunction(iTest);
    }

    testShouldCheckForUnimplementedMethods() {
        const iTest = getInterface(class TestInterface {
            foo() { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            foo() { }
        };

        new cTest2();

        this.expectException(SyntaxError);
        this.expectExceptionMessage('Method "foo" must be implemented.');
        new cTest();
    }

    testShouldCheckForUnimplementedStaticMethods() {
        const iTest = getInterface(class TestInterface {
            static foo() { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            static foo() { }
        };
        const cTest3 = class extends implementationOf(iTest) {
            foo() { }
        };

        new cTest2();
        new cTest3();

        this.expectException(SyntaxError);
        this.expectExceptionMessage('Method "foo" must be implemented.');
        new cTest();
    }

    testShouldCheckForUnimplementedGetSetters() {
        const iTest = getInterface(class TestInterface {
            get foo() { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            get foo() { }
        };

        new cTest2();

        this.expectException(SyntaxError);
        this.expectExceptionMessage('Getter/Setter for "foo" property must be implemented.');
        new cTest();
    }

    testShouldCheckForUnimplementedGetters() {
        const iTest = getInterface(class TestInterface {
            get foo() { }
        });

        const cTest2 = class extends implementationOf(iTest) {
            get foo() { }
        };
        const cTest3 = class extends implementationOf(iTest) {
            set foo(foo) { }
        };

        new cTest2();

        this.expectException(SyntaxError);
        this.expectExceptionMessage('Getter for "foo" property must be implemented.');
        new cTest3();
    }

    testShouldCheckForUnimplementedStaticGetters() {
        const iTest = getInterface(class TestInterface {
            static get foo() { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            static get foo() { }
        };

        new cTest2();

        this.expectException(SyntaxError);
        this.expectExceptionMessage('Getter for "foo" property must be implemented.');
        new cTest();
    }

    testShouldCheckForUnimplementedSetGetters() {
        const iTest = getInterface(class TestInterface {
            set foo(foo) { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            set foo(foo) { }
        };

        new cTest2();

        this.expectException(SyntaxError);
        this.expectExceptionMessage('Getter/Setter for "foo" property must be implemented.');
        new cTest();
    }

    testShouldCheckForUnimplementedSetters() {
        const iTest = getInterface(class TestInterface {
            set foo(foo) { }
        });

        const cTest2 = class extends implementationOf(iTest) {
            set foo(foo) { }
        };
        const cTest3 = class extends implementationOf(iTest) {
            get foo() { }
        };

        new cTest2();

        this.expectException(SyntaxError);
        this.expectExceptionMessage('Setter for "foo" property must be implemented.');
        new cTest3();
    }

    testShouldCheckForUnimplementedStaticSetters() {
        const iTest = getInterface(class TestInterface {
            static set foo(foo) { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            static set foo(foo) { }
        };

        new cTest2();

        this.expectException(SyntaxError);
        this.expectExceptionMessage('Setter for "foo" property must be implemented.');
        new cTest();
    }

    testShouldMakeInstanceofWork() {
        const iTest = getInterface(class TestInterface {});
        const iTest2 = getInterface(class Test2Interface {});

        class Foobar extends implementationOf(iTest) { }
        const o = new Foobar();

        __self.assertInstanceOf(Foobar, o);
        __self.assertInstanceOf(iTest, o);
        __self.assertNotInstanceOf(iTest2, o);
    }

    testCanBeExtended() {
        const iTest = getInterface(class TestInterface {});
        const iTest2 = getInterface(class Test2Interface {}, iTest);

        class Foobar extends implementationOf(iTest2) { }
        const o = new Foobar();

        __self.assertInstanceOf(Foobar, o);
        __self.assertInstanceOf(iTest, o);
        __self.assertInstanceOf(iTest2, o);
    }

    testShouldInheritInterfacesFromParentClasses() {
        const iTest = getInterface(class TestInterface {});
        const iTest2 = getInterface(class Test2Interface {});

        class Foo extends implementationOf(iTest) {}
        class FooBar extends mix(Foo, iTest2) {}

        const o = new FooBar();

        __self.assertInstanceOf(FooBar, o);
        __self.assertInstanceOf(iTest, o);
        __self.assertInstanceOf(iTest2, o);
    }

    testShouldExtendMultipleInterfaces() {
        const iParent = getInterface(class ParentInterface {});
        const iParent2 = getInterface(class Parent2Interface {});
        const iTest = getInterface(class TestInterface {}, iParent, iParent2);

        class Foo extends implementationOf(iTest) {}

        const o = new Foo();

        __self.assertInstanceOf(iTest, o);
        __self.assertInstanceOf(iParent, o);
        __self.assertInstanceOf(iParent2, o);
    }

    testGetTraitShouldReturnAnExtendableExpression() {
        const traitTest = getTrait(class TestTrait {});
        __self.assertIsFunction(traitTest);
    }

    testGetTraitShouldNotHaveInstanceof() {
        const traitTest = getTrait(class TestTrait {});
        class Foobar extends mix(undefined, traitTest) { }
        const o = new Foobar();

        this.expectException(TypeError);
        this.expectExceptionMessage('Function has non-object prototype \'undefined\' in instanceof check');

        (() => o instanceof traitTest)();
    }

    testTraitsShouldBeExtended() {
        const testTrait = getTrait(class TestTrait {
            foo() {
                return 'foo';
            }

            foobar() {
                return 'foobar';
            }
        });
        const testTraitEx = getTrait(class extends testTrait.definition {
            foo() {
                return 'bar';
            }

            bar() {
                return 'baz';
            }
        });

        class Foobar extends mix(undefined, testTraitEx) { }
        const o = new Foobar();

        __self.assertIsFunction(o.foo);
        __self.assertEquals('bar', o.foo());
        __self.assertIsFunction(o.bar);
        __self.assertIsFunction(o.foobar);
    }

    testTraitsConstructorShouldBeCalledUponObjectCreation() {
        const traitTest = getTrait(class TestTrait {
            __construct() {
                this.foo = 'foobar';
            }
        });
        class Foobar extends mix(undefined, traitTest) {
            __construct() {}
        }

        const obj = new Foobar();
        __self.assertEquals('foobar', obj.foo);
    }

    testConstantsShouldBeInheritedFromTrait() {
        const traitClass = class TestTrait { };
        traitClass.STATIC_VALUE = 'static';

        const traitTest = getTrait(traitClass);
        class Foobar extends mix(undefined, traitTest) { }

        __self.assertEquals('static', Foobar.STATIC_VALUE);
    }
}
