const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.Validator.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.Validator.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
