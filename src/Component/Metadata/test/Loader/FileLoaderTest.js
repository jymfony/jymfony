require('../../fixtures/namespace');

const ClassMetadata = Jymfony.Component.Metadata.ClassMetadata;
const FileLoader = Jymfony.Component.Metadata.Loader.FileLoader;
const Fixtures = Jymfony.Component.Metadata.Fixtures;
const { expect } = require('chai');

class TestLoader extends FileLoader {
    _loadClassMetadataFromFile(/* file_content, classMetadata */) {
        return true;
    }
}

describe('[Metadata] FileLoader', function () {
    it ('should throw on non-existent file', () => {
        const loader = new TestLoader(__dirname + '/non_existent.json');
        expect(() => loader.loadClassMetadata(new ClassMetadata(new ReflectionClass(Fixtures.ClassForMetadata)))).to.throw(
            Error,
            /ENOENT: no such file or directory/
        );
    });

    it ('should load class metadata from file', () => {
        const loader = new TestLoader(__dirname + '/../../fixtures/Loader/config.json');
        expect(loader.loadClassMetadata(new ClassMetadata(new ReflectionClass(Fixtures.ClassForMetadata))))
            .to.be.equal(true);
    });
});
