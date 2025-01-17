import { join } from 'node:path';

const Namespace = Jymfony.Component.Autoloader.Namespace;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

class GrandParent {
    get readProp() { }
    set writeProp(v) { }
}
class Parent extends GrandParent {
    parentMethod() { }
}
const ISon = getInterface(class SonInterface {
    getFoo() { }
});
const ISon2 = getInterface(class Son2Interface {});

const SonTrait = getTrait(class SonTrait {});
const SonTrait2 = getTrait(class SonTrait2 extends SonTrait.definition {});

class Son extends mix(Parent, ISon, SonTrait2) {
    constructor() {
        super(); this.foo = 'bar';
    }

    getFoo() { }

    get prop() { }
    set prop(v) { }
}

class Son2 extends mix(Parent, ISon, ISon2, SonTrait) {
    constructor() {
        super(); this.foo = 'bar';
    }

    getFoo() { }

    get prop() { }
    set prop(v) { }
}

Parent.CONST_1 = 'foobar';
Son.CONST_2 = 'foo';

export default class ReflectionClassTest extends TestCase {
    get testCaseName() {
        return '[Autoloader] ' + super.testCaseName;
    }

    testGetClassShouldWorkWithInternalClasses() {
        __self.assertSame(Date, ReflectionClass.getClass(Date));
    }

    testGetClassNameShouldWorkWithInternalClasses() {
        __self.assertEquals('Date', ReflectionClass.getClassName(Date));
        __self.assertEquals('String', ReflectionClass.getClassName(String));
    }

    testNewInstanceShouldReturnAnObject() {
        const reflClass = new ReflectionClass(Son);
        const obj = reflClass.newInstance();

        __self.assertNotUndefined(obj);
        __self.assertInstanceOf(Son, obj);
        __self.assertEquals('bar', obj.foo);
    }

    testNewInstanceWithoutConstructorShouldReturnAnObject() {
        const reflClass = new ReflectionClass(Son);
        const obj = reflClass.newInstanceWithoutConstructor();

        __self.assertNotUndefined(obj);
        __self.assertInstanceOf(Son, obj);
        __self.assertUndefined(obj.foo);
    }

    testNewInstanceWithoutConstructorShouldNotBreakInstanceofChain() {
        const reflClass = new ReflectionClass(Son);
        const obj = reflClass.newInstanceWithoutConstructor();

        __self.assertInstanceOf(Son, obj);
        __self.assertInstanceOf(Parent, obj);
        __self.assertInstanceOf(GrandParent, obj);
        __self.assertInstanceOf(ISon, obj);
    }

    testNewInstanceWithoutConstructorShouldReturnCorrectClassName() {
        const reflClass = new ReflectionClass(Son2);
        const obj = reflClass.newInstanceWithoutConstructor();

        __self.assertEquals('Jymfony.Component.Autoloader.Tests.Reflection.Son2', (new ReflectionClass(obj)).name);
    }

    testHasMethodShouldWork() {
        const reflClass = new ReflectionClass(Son);
        __self.assertTrue(reflClass.hasMethod('parentMethod'));
    }

    testHasPropertyShouldWork() {
        const reflClass = new ReflectionClass(Son);

        __self.assertTrue(reflClass.hasProperty('prop'));
        __self.assertTrue(reflClass.hasProperty('readProp'));
        __self.assertTrue(reflClass.hasProperty('writeProp'));
    }

    testHasReadablePropertyShouldWork() {
        const reflClass = new ReflectionClass(Son);

        __self.assertTrue(reflClass.hasReadableProperty('prop'));
        __self.assertTrue(reflClass.hasReadableProperty('readProp'));
        __self.assertFalse(reflClass.hasReadableProperty('writeProp'));
    }

    testHasWritablePropertyShouldWork() {
        const reflClass = new ReflectionClass(Son);

        __self.assertTrue(reflClass.hasWritableProperty('prop'));
        __self.assertFalse(reflClass.hasWritableProperty('readProp'));
        __self.assertTrue(reflClass.hasWritableProperty('writeProp'));
    }

    testGetParentClassShouldReturnAReflectionClassObject() {
        const reflClass = new ReflectionClass(Son);

        __self.assertInstanceOf(ReflectionClass, reflClass.getParentClass());
        __self.assertEquals(Parent, reflClass.getParentClass().getConstructor());
    }

    testShouldExposeInterfaces() {
        const reflClass = new ReflectionClass(Son);
        __self.assertCount(1, reflClass.interfaces);
        __self.assertEquals(ISon.definition, reflClass.interfaces[0].getConstructor());

        const reflClass2 = new ReflectionClass(Son2);
        __self.assertCount(2, reflClass2.interfaces);
        __self.assertEquals(ISon.definition, reflClass2.interfaces[0].getConstructor());
        __self.assertEquals(ISon2.definition, reflClass2.interfaces[1].getConstructor());
    }

    testShouldExposeTraits() {
        const reflClass = new ReflectionClass(Son);
        __self.assertCount(2, reflClass.traits);
        __self.assertEquals(SonTrait2.definition, reflClass.traits[0].getConstructor());
        __self.assertEquals(SonTrait.definition, reflClass.traits[1].getConstructor());

        const reflClass2 = new ReflectionClass(Son2);
        __self.assertCount(1, reflClass2.traits);
        __self.assertEquals(SonTrait.definition, reflClass2.traits[0].getConstructor());
    }

    testMethodsGetterShouldWork() {
        const reflClass = new ReflectionClass(Son);

        __self.assertEquals([ 'getFoo', 'constructor', 'parentMethod' ], reflClass.methods);
    }

    testPropertiesGetterShouldWork() {
        const reflClass = new ReflectionClass(Son);

        __self.assertEquals([ 'prop', 'readProp', 'writeProp' ], reflClass.properties);
    }

    testConstantsGetterShouldWork() {
        const reflClass = new ReflectionClass(Son);

        __self.assertEquals({
            CONST_1: 'foobar',
            CONST_2: 'foo',
        }, reflClass.constants);
    }

    testIsSubclassOfShouldWork() {
        let reflClass = new ReflectionClass(Son2);

        __self.assertFalse(reflClass.isSubclassOf(Son2));
        __self.assertTrue(reflClass.isSubclassOf(ISon2));
        __self.assertTrue(reflClass.isSubclassOf(ISon));
        __self.assertTrue(reflClass.isSubclassOf(Parent));
        __self.assertTrue(reflClass.isSubclassOf(GrandParent));

        reflClass = new ReflectionClass(Son);

        __self.assertFalse(reflClass.isSubclassOf(Son));
        __self.assertFalse(reflClass.isSubclassOf(ISon2));
        __self.assertTrue(reflClass.isSubclassOf(ISon));
        __self.assertTrue(reflClass.isSubclassOf(Parent));
        __self.assertTrue(reflClass.isSubclassOf(GrandParent));
    }

    testIsInstanceOfShouldWork() {
        let reflClass = new ReflectionClass(Son2);

        __self.assertTrue(reflClass.isInstanceOf(Son2));
        __self.assertTrue(reflClass.isInstanceOf(ISon2));
        __self.assertTrue(reflClass.isInstanceOf(ISon));
        __self.assertTrue(reflClass.isInstanceOf(Parent));
        __self.assertTrue(reflClass.isInstanceOf(GrandParent));

        reflClass = new ReflectionClass(Son);

        __self.assertTrue(reflClass.isInstanceOf(Son));
        __self.assertFalse(reflClass.isInstanceOf(ISon2));
        __self.assertTrue(reflClass.isInstanceOf(ISon));
        __self.assertTrue(reflClass.isInstanceOf(Parent));
        __self.assertTrue(reflClass.isInstanceOf(GrandParent));
    }

    testIsInterfaceShouldWork() {
        let reflClass = new ReflectionClass(Son);
        __self.assertFalse(reflClass.isInterface);

        reflClass = new ReflectionClass(ISon);
        __self.assertTrue(reflClass.isInterface);
    }

    testExposesInterfaceMethods() {
        const reflClass = new ReflectionClass(ISon);
        __self.assertEquals([ 'getFoo' ], reflClass.methods);
    }

    testExposesPublicInstanceFields() {
        const ns = new Namespace(__jymfony.autoload, 'Foo', join(__dirname, '..', '..', 'fixtures'), __jymfony.autoload.classLoader._internalRequire);
        const x = new ns.PublicFieldsClass();

        const reflClass = new ReflectionClass(x);
        __self.assertTrue(reflClass.hasField('field'));
        __self.assertTrue(reflClass.hasField('bar'));

        const field = reflClass.getField('field');
        __self.assertFalse(field.isStatic);
        __self.assertFalse(field.isPrivate);
        __self.assertEquals('foobar', field.getValue(x));

        const bar = reflClass.getField('bar');
        __self.assertTrue(bar.isStatic);
        __self.assertFalse(field.isPrivate);
        __self.assertEquals('bar', bar.getValue(null));
    }

    testClassInstanceFieldsAreInitializedBefore__constructCall() {
        const ns = new Namespace(__jymfony.autoload, 'Foo', join(__dirname, '..', '..', 'fixtures'), __jymfony.autoload.classLoader._internalRequire);
        const x = new ns.PublicFieldsClassWithConstruct();

        __self.assertEquals('foobar', x.initializedField);
    }

    testExposesPrivateInstanceFields() {
        const ns = new Namespace(__jymfony.autoload, 'Foo', join(__dirname, '..', '..', 'fixtures'), __jymfony.autoload.classLoader._internalRequire);
        const x = new ns.PrivateFieldsClass();

        const reflClass = new ReflectionClass(x);
        __self.assertTrue(reflClass.hasField('#field'));
        __self.assertTrue(reflClass.hasField('#bar'));

        const field = reflClass.getField('#field');
        __self.assertFalse(field.isStatic);
        __self.assertTrue(field.isPrivate);
        try {
            field.getValue(x);
            throw new Error('FAIL');
        } catch (e) {
            __self.assertInstanceOf(ReflectionException, e);
        }

        field.accessible = true;
        __self.assertEquals('foobar', field.getValue(x));

        const bar = reflClass.getField('#bar');
        __self.assertTrue(bar.isStatic);
        __self.assertTrue(bar.isPrivate);
        bar.accessible = true;
        __self.assertEquals('bar', bar.getValue(null));
    }

    testExposesPrivateInstanceFieldsMetadata() {
        const ns = new Namespace(__jymfony.autoload, 'Foo', join(__dirname, '..', '..', 'fixtures'), __jymfony.autoload.classLoader._internalRequire);
        const x = new ns.ParameterMetadata();

        const reflClass = new ReflectionClass(x);
        const method = reflClass.getMethod('method');

        __self.assertEmpty(method.parameters[0].metadata);

        __self.assertCount(1, method.parameters[1].metadata);
        __self.assertEquals('foo', method.parameters[1].metadata[0][1]);

        __self.assertCount(1, method.parameters[2].metadata);
        __self.assertEquals('string', method.parameters[2].metadata[0][1]);
    }

    testExposesConstructorMethod() {
        const ns = new Namespace(__jymfony.autoload, 'Foo', join(__dirname, '..', '..', 'fixtures'), __jymfony.autoload.classLoader._internalRequire);
        const x = new ns.FoobarClass();

        const reflClass = new ReflectionClass(x);
        __self.assertNotUndefined(reflClass.constructorMethod);
        __self.assertCount(1, reflClass.constructorMethod.parameters);
    }
}
