const ClassMetadata = Jymfony.Component.Metadata.ClassMetadata;

/**
 * @memberOf Jymfony.Component.Metadata.Fixtures
 */
export default class MetadataClassWithAttributes extends ClassMetadata {
    __construct(reflectionClass) {
        super.__construct(reflectionClass);

        this.attributeOne = undefined;
        this.attributeTwo = undefined;
        this._attributePrivate = 'private';
    }
}
