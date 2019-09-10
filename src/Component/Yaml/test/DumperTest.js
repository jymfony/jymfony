const Dumper = Jymfony.Component.Yaml.Dumper;
const Parser = Jymfony.Component.Yaml.Parser;
const Yaml = Jymfony.Component.Yaml.Yaml;
const { expect } = require('chai');
const { readFileSync } = require('fs');

const fixturesDir = __dirname + '/../fixtures/';

function loadTestsFromFixtureFiles(testsFile) {
    const parser = new Parser();

    const tests = [];
    const files = parser.parseFile(fixturesDir + testsFile);
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
                tests.push([ null, null, null ]);
            } else {
                let expected;
                eval('expected = ' + __jymfony.trim(test['js']) + ';');

                tests.push([ expected, test['test'] ]);
            }
        }
    }

    return tests;
}

const arr = {
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
};

describe('[Yaml] Dumper', function () {
    beforeEach(() => {
        this._dumper = new Dumper();
        this._parser = new Parser();
    });

    it ('should respect indentation in constructor', () => {
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

        expect(dumper.dump(arr, 4, 0)).to.be.eq(expected);
    });

    for (const [ index, [ expected, comment ] ] of __jymfony.getEntries(loadTestsFromFixtureFiles('index.yml'))) {
        it ('should respect specification #' + index, null !== expected ? () => {
            const dumped = this._dumper.dump(expected, 10);
            expect(this._parser.parse(dumped, Yaml.PARSE_CUSTOM_TAGS)).to.be.deep.eq(expected, comment);
        } : undefined);
    }

    const escapeSequences = {
        'empty string': [ '', '\'\'' ],
        'null': [ '\x00', '"\\0"' ],
        'bell': [ '\x07', '"\\a"' ],
        'backspace': [ '\x08', '"\\b"' ],
        'horizontal-tab': [ '\t', '"\\t"' ],
        'line-feed': [ '\n', '"\\n"' ],
        'vertical-tab': [ '\v', '"\\v"' ],
        'form-feed': [ '\x0C', '"\\f"' ],
        'carriage-return': [ '\r', '"\\r"' ],
        'escape': [ '\x1B', '"\\e"' ],
        'space': [ ' ', '\' \'' ],
        'double-quote': [ '"', '\'"\'' ],
        'slash': [ '/', '/' ],
        'backslash': [ '\\', '\\' ],
        'next-line': [ '\xC2\x85', '"\\N"' ],
        'non-breaking-space': [ '\xc2\xa0', '"\\_"' ],
        'line-separator': [ '\xE2\x80\xA8', '"\\L"' ],
        'paragraph-separator': [ '\xE2\x80\xA9', '"\\P"' ],
        'colon': [ ':', '\':\'' ],
    };

    for (const [ comment, [ input, expected ] ] of __jymfony.getEntries(escapeSequences)) {
        it ('should escape ' + comment, () => {
            expect(this._dumper.dump(input)).to.be.eq(expected);
        });
    }
});
