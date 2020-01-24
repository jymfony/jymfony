require('../../fixtures/namespace');

const ClassMetadata = Jymfony.Component.Metadata.ClassMetadata;
const FilesLoader = Jymfony.Component.Metadata.Loader.FilesLoader;
const LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

class FilesLoaderTestLoader extends FilesLoader {
    __construct(paths, loader) {
        this._loader = loader;
        super.__construct(paths);
    }

    _getLoader() {
        return this._loader;
    }
}

describe('[Metadata] FilesLoader', function () {
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

    it ('loader should be called', () => {
        const fileLoader = prophet.prophesize(LoaderInterface);
        fileLoader.loadClassMetadata(Argument.cetera()).shouldBeCalledTimes(3);

        const loader = new FilesLoaderTestLoader([
            'test1.yml',
            'test2.yml',
            'test3.yml',
        ], fileLoader.reveal());

        loader.loadClassMetadata(prophet.prophesize(ClassMetadata).reveal());
    });

    it ('should throw if no loader class is set', () => {
        expect(() => new FilesLoader([
            'test1.yml',
            'test2.yml',
            'test3.yml',
        ])).to.throw(RuntimeException);
    });
});
