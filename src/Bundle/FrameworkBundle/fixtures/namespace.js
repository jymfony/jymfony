const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Bundle.FrameworkBundle.Tests = new Namespace(__jymfony.autoload, 'Jymfony.Bundle.FrameworkBundle.Tests');

    /**
     * @namespace
     */
    Jymfony.Bundle.FrameworkBundle.Tests.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures', __dirname);

    registered = true;
}
