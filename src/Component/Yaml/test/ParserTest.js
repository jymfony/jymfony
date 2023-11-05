import { chmodSync, readFileSync } from 'fs';
import { Script } from 'vm';

const Parser = Jymfony.Component.Yaml.Parser;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Yaml = Jymfony.Component.Yaml.Yaml;

const fixturesDir = __dirname + '/../fixtures/';

export default class ParserTest extends TestCase {
    _parser;

    get testCaseName() {
        return '[Yaml] ' + super.testCaseName;
    }

    beforeEach() {
        this._parser = new Parser();
    }

    afterEach() {
        chmodSync(fixturesDir + '/not_readable.yml', 0o644);
    }

    @dataProvider('provideDataFromFixturesFile')
    testShouldRespectSpecification(expected, yaml, comment) {
        if (null === expected) {
            __self.markTestSkipped();
        }

        __self.assertEquals(expected, this._parser.parse(yaml, Yaml.PARSE_CUSTOM_TAGS), comment);
    }

    provideDataFromFixturesFile() {
        const parser = new Parser();

        const tests = [];
        const files = parser.parseFile(fixturesDir + 'index.yml');
        for (const file of files) {
            const yamls = readFileSync(fixturesDir + file + '.yml').toString('utf-8');

            // Split YAMLs documents
            for (const yaml of yamls.split(/^--- %YAML:1\.0|^---/mg)) {
                if (! yaml) {
                    continue;
                }

                const test = parser.parse(yaml);
                if (!! test.todo) {
                    tests.push([ null, null, null ]);
                } else {
                    const s = new Script('(function () { return ' + __jymfony.trim(test['js']) + '; })');
                    const expected = s.runInThisContext()();

                    tests.push([ expected, test['yaml'], test['test'] ]);
                }
            }
        }

        return tests;
    }

    testShouldThrowEvalRefException() {
        const yaml = 'foo: { &foo { a: Steve, <<: *foo} }';

        this.expectExceptionMessageRegex(/Reference "foo" does not exist/);
        this._parser.parse(yaml);
    }

    * provideCircularReferenceTests() {
        yield [ `
foo:
    - &foo
      - &bar
        bar: foobar
        baz: *foo
` ];
        yield [ `
foo: &foo
    bar: &bar
        foobar: baz
        baz: *foo
` ];
        yield [ `
foo: &foo
    bar: &bar
        foobar: baz
        <<: *foo
` ];
    }

    @dataProvider('provideCircularReferenceTests')
    testShouldDetectCircularReference(yaml) {
        this.expectExceptionMessageRegex(/Circular reference \[foo, bar, foo\] detected/);
        this._parser.parse(yaml, Yaml.PARSE_CUSTOM_TAGS);
    }
}
