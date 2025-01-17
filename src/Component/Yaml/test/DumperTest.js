import { Script } from 'vm';
import { readFileSync } from 'fs';

const Dumper = Jymfony.Component.Yaml.Dumper;
const Parser = Jymfony.Component.Yaml.Parser;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Yaml = Jymfony.Component.Yaml.Yaml;

const fixturesDir = __dirname + '/../fixtures/';

export default class DumperTest extends TestCase {
    _dumper;
    _parser;

    get testCaseName() {
        return '[Yaml] ' + super.testCaseName;
    }

    beforeEach() {
        this._dumper = new Dumper();
        this._parser = new Parser();
    }

    testShouldRespectIndentationInConstructor() {
        const dumper = new Dumper(7);
        const expected = `'': bar
foo: '#bar'
'foo''bar': {  }
bar:
       - 1
       - foo
foobar:
       foo: bar
       bar:
              - 1
              - foo
       foobar:
              foo: bar
              bar:
                     - 1
                     - foo
`;

        __self.assertEquals(expected, dumper.dump({
            '': 'bar',
            'foo': '#bar',
            'foo\'bar': {},
            'bar': [ 1, 'foo' ],
            'foobar': {
                'foo': 'bar',
                'bar': [ 1, 'foo' ],
                'foobar': {
                    'foo': 'bar',
                    'bar': [ 1, 'foo' ],
                },
            },
        }, 4, 0));
    }

    @dataProvider('provideSpecificationsTests')
    testShouldRespectSpecification(expected, comment) {
        if (null === expected) {
            __self.markTestSkipped();
        }

        const dumped = this._dumper.dump(expected, 10);
        __self.assertEquals(expected, this._parser.parse(dumped, Yaml.PARSE_CUSTOM_TAGS), comment);
    }

    * provideSpecificationsTests() {
        const parser = new Parser();
        const files = parser.parseFile(fixturesDir + 'index.yml');
        for (const file of files) {
            const yamls = readFileSync(fixturesDir + file + '.yml').toString('utf-8');

            // Split YAMLs documents
            for (const yaml of yamls.split(/^--- %YAML:1\.0|^---/mg)) {
                if (! yaml) {
                    continue;
                }

                const test = parser.parse(yaml);
                if (!! test.dump_skip) {
                    continue;
                }

                if (!! test.todo) {
                    yield [ null, null ];
                } else {
                    const s = new Script('(function () { return ' + __jymfony.trim(test['js']) + '; })');
                    const expected = s.runInThisContext()();

                    yield [ expected, test.test ];
                }
            }
        }
    }

    @dataProvider('provideEscapeTests')
    testShouldEscapeCharacters(comment, input, expected) {
        __self.assertEquals(expected, this._dumper.dump(input), comment);
    }

    * provideEscapeTests() {
        yield [ 'empty string', '', '\'\'' ];
        yield [ 'null', '\x00', '"\\0"' ];
        yield [ 'bell', '\x07', '"\\a"' ];
        yield [ 'backspace', '\x08', '"\\b"' ];
        yield [ 'horizontal-tab', '\t', '"\\t"' ];
        yield [ 'line-feed', '\n', '"\\n"' ];
        yield [ 'vertical-tab', '\v', '"\\v"' ];
        yield [ 'form-feed', '\x0C', '"\\f"' ];
        yield [ 'carriage-return', '\r', '"\\r"' ];
        yield [ 'escape', '\x1B', '"\\e"' ];
        yield [ 'space', ' ', '\' \'' ];
        yield [ 'double-quote', '"', '\'"\'' ];
        yield [ 'slash', '/', '/' ];
        yield [ 'backslash', '\\', '\\' ];
        yield [ 'next-line', '\xC2\x85', '"\\N"' ];
        yield [ 'non-breaking-space', '\xc2\xa0', '"\\_"' ];
        yield [ 'line-separator', '\xE2\x80\xA8', '"\\L"' ];
        yield [ 'paragraph-separator', '\xE2\x80\xA9', '"\\P"' ];
        yield [ 'colon', ':', '\':\'' ];
    }
}
