declare namespace Jymfony.Component.Autoloader.Metadata {
    export class MetadataHelper {
        static ensureMetadataStorageHasBeenInitialized(context: { kind: string, index?: number, name: string | symbol, metadata: object, function?: object }): void;

        static getMetadataTarget(context: { kind: string, index?: number, name: string | symbol, metadata: object, function?: object }): object;
    }
}
