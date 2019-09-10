const Parser = Jymfony.Component.Yaml.Parser;
const Yaml = Jymfony.Component.Yaml.Yaml;
const { expect } = require('chai');
const { readFileSync, chmodSync } = require('fs');

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
            if (!! test.todo) {
                tests.push([ null, null, null ]);
            } else {
                let expected;
                eval('expected = ' + __jymfony.trim(test['js']) + ';');

                tests.push([ expected, test['yaml'], test['test'] ]);
            }
        }
    }

    return tests;
}

describe('[Yaml] Parser', function () {
    beforeEach(() => {
        this._parser = new Parser();
    });

    afterEach(() => {
        chmodSync(fixturesDir + '/not_readable.yml', 0o644);
    });

    for (const [ index, [ expected, yaml, comment ] ] of __jymfony.getEntries(loadTestsFromFixtureFiles('index.yml'))) {
        it ('should respect specification #' + index, null !== expected ? () => {
            expect(this._parser.parse(yaml, Yaml.PARSE_CUSTOM_TAGS)).to.be.deep.equal(expected, comment);
        } : undefined);
    }

    it ('should throw eval ref exception', () => {
        const yaml = 'foo: { &foo { a: Steve, <<: *foo} }';

        expect(() => this._parser.parse(yaml)).to.throw(/Reference "foo" does not exist/);
    });

    const circularReferenceTests = [
        [ 'sequence', `
foo:
    - &foo
      - &bar
        bar: foobar
        baz: *foo
` ],
        [ 'mapping', `
foo: &foo
    bar: &bar
        foobar: baz
        baz: *foo
` ],
        [ 'mapping with merge key', `
foo: &foo
    bar: &bar
        foobar: baz
        <<: *foo
` ],
    ];

    for (const [ name, yaml ] of circularReferenceTests) {
        it ('should detect circular reference: ' + name, () => {
            expect(() => this._parser.parse(yaml, Yaml.PARSE_CUSTOM_TAGS))
                .to.throw(/Circular reference \[foo, bar, foo\] detected/);
        });
    }
});
