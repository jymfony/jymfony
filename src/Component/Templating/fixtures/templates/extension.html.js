await view.extend('extended.html.js');

view.slots.start('head');
    await out('<script type="text/javascript" src="//localhost/script.js"></script>');
view.slots.stop();

view.slots.start('body_content');
    await out('This is body content from child');
view.slots.stop();
