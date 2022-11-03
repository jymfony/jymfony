declare namespace Jymfony.Component.Autoloader.Decorator {
    type MetadataConstructor = {
        (key: any, value: any): (value: any, context: any) => void;
    }

    export var Metadata: MetadataConstructor;
}
