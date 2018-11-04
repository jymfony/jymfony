const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const RewindableGenerator = Jymfony.Component.DependencyInjection.Argument.RewindableGenerator;

class ProjectContainer extends Jymfony.Component.DependencyInjection.Container {
    __construct(buildParameters = {}) {
        super.__construct(new FrozenParameterBag(Object.assign({}, ProjectContainer._getDefaultsParameters(), buildParameters)));

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

module.exports = ProjectContainer;
