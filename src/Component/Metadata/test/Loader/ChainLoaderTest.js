require('../../fixtures/namespace');

const ClassMetadata = Jymfony.Component.Metadata.ClassMetadata;
const ChainLoader = Jymfony.Component.Metadata.Loader.ChainLoader;
const LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;
const Fixtures = Jymfony.Component.Metadata.Fixtures;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[Metadata] ChainLoader', function () {
    /**
     * @type {Jymfony.Component.Testing.Prophet}
     */
    let prophet;

    beforeEach(() => {
        prophet = new Prophet();
    });

    afterEach(() => {
        if ('failed' === this.ctx.currentTest.state) {
            return;
        }

        prophet.checkPredictions();
    });

    it ('should throw on non-loader instance', () => {
        expect(() => new ChainLoader([ Object.create(null) ])).to.throw(InvalidArgumentException);
    });

    it ('should call all loaders', () => {
        const loader1 = prophet.prophesize(LoaderInterface);
        const loader2 = prophet.prophesize(LoaderInterface);
        const loader3 = prophet.prophesize(LoaderInterface);

        const metadata = new ClassMetadata(new ReflectionClass(Fixtures.ClassForMetadata));

        loader1.loadClassMetadata(metadata).shouldBeCalled();
        loader2.loadClassMetadata(metadata).shouldBeCalled();
        loader3.loadClassMetadata(metadata).shouldBeCalled();

        const loader = new ChainLoader([
            loader1.reveal(),
            loader2.reveal(),
            loader3.reveal(),
        ]);

        loader.loadClassMetadata(metadata);
    });
});
