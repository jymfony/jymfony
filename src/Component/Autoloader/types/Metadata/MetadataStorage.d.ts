declare class MetadataStorage {
    /**
     * Defines a metadata.
     */
    static defineMetadata(key: object, value: any, target: Newable<any>, prop: PropertyKey): void;

    /**
     * Retrieves metadata for target.
     */
    static getMetadata(target: Newable<any>, prop: PropertyKey): [ object, any ][];
}

declare namespace NodeJS {
    interface Global {
        MetadataStorage: MetadataStorage,
    }
}
