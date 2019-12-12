const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.PropertyAccess.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.PropertyAccess.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
