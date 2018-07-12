const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;

class ProjectContainer extends Jymfony.Component.DependencyInjection.Container {
    __construct() {
        super.__construct(new FrozenParameterBag(ProjectContainer._getDefaultsParameters()));

        this._methodMap = {
            "foo": "getFooService",
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
     * Gets the public 'foo' shared service.
     *
     * @returns {Bar.Foo}
     */
    getFooService() {
        return this._services["foo"] = new Bar.Foo(this.getParameter("env(BAR)"), {"LANG": ""+this.getParameter("env(LANG)")+" is "+this.getParameter("env(FOO)")+"", "foobar": "bar"}, true, this);
    }

    static _getDefaultsParameters() {
        return {
            "foo": "bar",
            "env(foo)": "bar",
        };
    }
}

module.exports = global.ProjectContainer = ProjectContainer;
