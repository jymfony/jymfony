const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.Lexer.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Lexer.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
