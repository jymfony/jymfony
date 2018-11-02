const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.Cache.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Cache.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
