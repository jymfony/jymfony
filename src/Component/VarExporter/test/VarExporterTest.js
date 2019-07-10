const VarExporter = Jymfony.Component.VarExporter.VarExporter;
const { expect } = require('chai');
const fs = require('fs');

require('../fixtures/namespace');
const Fixtures = Jymfony.Component.VarExporter.Fixtures;

describe('[VarExporter] VarExporter', function () {
    const exporterTests = function * () {
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
    };

    let i = 0;
    for (const [ testName, value ] of exporterTests()) {
        it('export #' + ++i, () => {
            const marshalledValue = VarExporter.export(value);
            const code = fs.readFileSync(__dirname + '/../fixtures/exported/' + testName + '.js').toString();

            expect(marshalledValue).to.be.equal(code);

            // Try to evaluate exported value.
            eval(marshalledValue);
        });
    }
});
