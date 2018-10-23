const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.Security.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Security.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
