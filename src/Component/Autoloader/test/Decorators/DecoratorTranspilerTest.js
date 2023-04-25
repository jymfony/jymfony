import { join } from 'path';

const Namespace = Jymfony.Component.Autoloader.Namespace;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const fixturesDir = join(__dirname, '..', '..', 'fixtures');

export default class DecoratorTranspilerTest extends TestCase {
    get testCaseName() {
        return '[Autoloader] ' + super.testCaseName;
    }

    afterEach() {
        delete global.Foo;
    }

    testShouldTranspileAnnotations() {
        global.Foo = new Namespace(__jymfony.autoload, 'Foo', fixturesDir, __jymfony.autoload.classLoader._internalRequire);
        const a = new Foo.Annotated();
        const r = new ReflectionClass(a);

        const annotation = new ReflectionClass(Foo.Decorators.TestAnnotation).getConstructor();

        __self.assertCount(1, r.metadata);
        __self.assertEquals(annotation, r.metadata[0][0]);
        __self.assertInstanceOf(Foo.Decorators.TestAnnotation, r.metadata[0][1][1]);
        __self.assertEquals({ value: 24 }, r.metadata[0][1][1]._value);

        __self.assertEquals([ [ annotation, new Foo.Decorators.TestAnnotation({ prop: 'test' }) ] ], r.getField('_value').metadata);
        __self.assertEquals([ [ annotation, new Foo.Decorators.TestAnnotation(undefined) ] ], r.getMethod('getValue').metadata);
        __self.assertEquals([ [ annotation, new Foo.Decorators.TestAnnotation(null) ] ], r.getReadableProperty('value').metadata);
    }
}
