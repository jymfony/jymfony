const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.VarDumper.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.VarDumper.Fixtures', [
        __dirname,
    ]);

    registered = true;
}
