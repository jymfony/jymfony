await out(`<!doctype html>
<html lang="en">
<head>
    <link rel="stylesheet" href="//localhost/style.css" />
`);

await view.slots.output('head');

await out(`
</head>
<body>
`)

await view.slots.output('body_content');

await out('\n</body>\n');
await out('</html>\n');
