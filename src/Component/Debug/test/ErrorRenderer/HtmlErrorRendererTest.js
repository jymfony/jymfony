const HtmlErrorRenderer = Jymfony.Component.Debug.ErrorRenderer.HtmlErrorRenderer;
const { expect } = require('chai');

describe('[Debug] HtmlErrorRenderer', function () {
    const expectedDebug = `<!-- Foo \\(500 Internal Server Error\\) -->
<!DOCTYPE html>
<html lang="en">
(.|\\n)+<title>Foo \\(500 Internal Server Error\\)</title>
(.|\\n)+<div class="trace trace-as-html" id="trace-box-1">(.|\\n)+
<!-- Foo \\(500 Internal Server Error\\) -->`;

    const expectedNonDebug = `<!DOCTYPE html>
<html>
(.|\\n)+<title>An Error Occurred: Internal Server Error</title>
(.|\\n)+<h2>The server returned a "500 Internal Server Error".</h2>(.|\\n)+`;

    const tests = [
        [ new RuntimeException('Foo'), new HtmlErrorRenderer(true), expectedDebug ],
        [ new RuntimeException('foo'), new HtmlErrorRenderer(false), expectedNonDebug ],
    ];

    for (const [ exception, errorRenderer, expected ] of tests) {
        it ('render should work correctly', () => {
            expect(errorRenderer.render(exception).asString)
                .to.match(new RegExp(expected));
        });
    }
});
