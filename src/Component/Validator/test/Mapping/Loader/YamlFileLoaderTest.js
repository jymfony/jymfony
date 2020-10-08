import JsonFileLoaderTest from './JsonFileLoaderTest';
const YamlFileLoader = Jymfony.Component.Validator.Mapping.Loader.YamlFileLoader;

export default class YamlFileLoaderTest extends JsonFileLoaderTest {
    provideEmptyMapping() {
        return __dirname + '/empty-mapping.yaml';
    }

    * provideInvalidFiles() {
        yield [ __dirname + '/nonvalid-mapping.yaml' ];
        yield [ __dirname + '/bad-format.yaml' ];
    }

    provideConstraintMapping() {
        return __dirname + '/constraint-mapping.yaml';
    }

    _createLoader(file) {
        return new YamlFileLoader(file);
    }
}
