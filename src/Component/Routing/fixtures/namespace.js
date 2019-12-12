const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.Routing.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Routing.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
