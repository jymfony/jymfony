const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.DependencyInjection.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.DependencyInjection.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
