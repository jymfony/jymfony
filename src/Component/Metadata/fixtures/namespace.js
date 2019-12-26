const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.Metadata.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Metadata.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
