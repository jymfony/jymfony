const fs = require("fs");
const path = require("path");
const expect = require('chai').expect;

const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const FileLocator = Jymfony.Component.Config.FileLocator;
const fixturesPath = path.join(__dirname, '..', '..', 'fixtures');

describe('[DependencyInjection] JsFileLoader', function () {
    it('supports js files', () => {
        let loader = new JsFileLoader(new ContainerBuilder(), new FileLocator());

        expect(loader.supports('foo.js')).to.be.true;
        expect(loader.supports('foo.foo')).to.be.false;
        expect(loader.supports('wrong_ext.yaml', 'js')).to.be.true;
    });

    it('load', () => {
        let container;
        let loader = new JsFileLoader(container = new ContainerBuilder(), new FileLocator());
        loader.load(path.join(fixturesPath, 'js', 'simple.js'));

        expect(container.getParameter('foo')).to.be.equal('foo');
    });
});
