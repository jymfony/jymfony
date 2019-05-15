const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.VarExporter.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.VarExporter.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
