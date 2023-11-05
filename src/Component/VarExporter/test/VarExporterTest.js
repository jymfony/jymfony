import { Script } from 'vm';
import { readFileSync } from 'fs';

const Fixtures = Jymfony.Component.VarExporter.Fixtures;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const VarExporter = Jymfony.Component.VarExporter.VarExporter;

export default class VarExporterTest extends TestCase {
    get testCaseName() {
        return '[VarExporter] ' + super.testCaseName;
    }

    @dataProvider('provideTests')
    testExport(testName, value) {
        const marshalledValue = VarExporter.export(value);
        const code = readFileSync(__dirname + '/../fixtures/exported/' + testName + '.js').toString();

        __self.assertEquals(code, marshalledValue);

        // Try to evaluate exported value.
        new Script(marshalledValue).runInThisContext();
    }

    * provideTests() {
        let v;

        yield [ 'multiline-string', {'\0\0\r\nA': 'B\rC\n\n'} ];
        yield [ 'boolean', true ];

        v = [ 1, {} ];
        yield [ 'array-with-object', v ];

        v = new Fixtures.MyWakeup();
        v.sub = new Fixtures.MyWakeup();
        v.sub.sub = 123;
        v.sub.bis = 123;
        v.sub.baz = 123;
        yield [ 'wakeup', v ];

        yield [ 'abstract-parent', new Fixtures.ConcreteClass() ];
        yield [ 'object-with-empty-string', { x: '' } ];
    }
}
