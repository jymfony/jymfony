const FieldMetadata = Jymfony.Component.Metadata.FieldMetadata;

/**
 * @memberOf Jymfony.Component.Metadata.Fixtures
 */
export default class VirtualFieldMetadata extends FieldMetadata {
    get value() {
        return 'FOO_BAR';
    }
}
