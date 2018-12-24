const JsEngine = Jymfony.Component.Templating.Engine.JsEngine;
const Loader = Jymfony.Component.Templating.Loader.Loader;
const TemplateNameParser = Jymfony.Component.Templating.TemplateNameParser;
const expect = require('chai').expect;

describe('[Templating] JsEngine', function () {
    it('should stream basic template', async () => {
        const engine = new JsEngine(new TemplateNameParser(), new Loader(__dirname + '/../../fixtures/templates/%name%'));

        const stream = new __jymfony.StreamBuffer();
        await engine.render(stream, 'foo.txt.js', { foo: 'foobar' });

        expect(stream.buffer.toString()).to.be.equal('Hello world!\nfoobar');
    });
});
