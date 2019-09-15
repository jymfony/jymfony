const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const RewindableGenerator = Jymfony.Component.DependencyInjection.Argument.RewindableGenerator;
const path = require('path');

class ProjectContainer extends Jymfony.Component.DependencyInjection.Container {
    __construct(buildParameters = {}) {
        super.__construct(new FrozenParameterBag(Object.assign({}, this._getDefaultsParameters(), buildParameters)));

        this._methodMap = {
            "bar": "getBarService",
            "foo": "getFooService",
            "foo.baz": "getFoo_BazService",
        };

        this._aliases = {
        };

        this._privates = {};
    }

    compile() {
        throw new LogicException('You cannot compile a dumped container');
    }

    get frozen() {
        return true;
    }

    /**
     * Gets the public 'bar' shared service.
     *
     * @returns {Bar.FooClass}
     */
    getBarService() {
        return this._services["bar"] = new Bar.FooClass();
    }

    /**
     * Gets the public 'foo' shared service.
     *
     * @returns {Object}
     */
    getFooService() {
        let instance;
        this._services["foo"] = instance = require("module1");

        instance.foo = "bar";
        instance.qux = {"bar": "foo is bar", "foobar": "bar"};
        instance.setBar((this._services["bar"] || this.getBarService()));
        instance.initialize();
        sc_configure(instance);
        return instance;
    }

    /**
     * Gets the public 'foo.baz' shared service.
     *
     * @returns {BazClass}
     */
    getFoo_BazService() {
        let instance;
        this._services["foo.baz"] = instance = new (require("BazClass")["prop"])("foo", (this._services["foo"] || this.getFooService()), {"bar": "foo is bar", "foobar": "bar"}, true, this);

        BazClass.configureStatic1(instance);
        return instance;
    }

    _getDefaultsParameters() {
        return {
            "baz.class": "BazClass",
            "foo_class": "Bar.FooClass",
            "foo": "bar",
        };
    }
}

module.exports = ProjectContainer;
