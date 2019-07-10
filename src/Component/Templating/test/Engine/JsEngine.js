const JsEngine = Jymfony.Component.Templating.Engine.JsEngine;
const Loader = Jymfony.Component.Templating.Loader.Loader;
const TemplateNameParser = Jymfony.Component.Templating.TemplateNameParser;
const { expect } = require('chai');

describe('[Templating] JsEngine', function () {
    beforeEach(() => {
        this._engine = new JsEngine(new TemplateNameParser(), new Loader(__dirname + '/../../fixtures/templates/%name%'));
    });

    it('should stream basic template', async () => {
        const stream = new __jymfony.StreamBuffer();
        await this._engine.render(stream, 'foo.txt.js', { foo: 'foobar' });

        expect(stream.buffer.toString()).to.be.equal('Hello world!\nfoobar');
    });

    it('should stream extended template', async () => {
        const stream = new __jymfony.StreamBuffer();
        await this._engine.render(stream, 'extension.html.js');

        expect(stream.buffer.toString()).to.be.equal(`<!doctype html>
<html lang="en">
<head>
    <link rel="stylesheet" href="//localhost/style.css" />
<script type="text/javascript" src="//localhost/script.js"></script>
</head>
<body>
This is body content from child
</body>
</html>
`);
    });
});
