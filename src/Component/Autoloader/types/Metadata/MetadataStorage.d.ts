declare class MetadataStorage {
    /**
     * Adds a metadata value for the given key.
     * This allows to use the same annotation multiple time on
     * the same target.
     */
    static addMetadata(key: object, value: any, target: Newable<any>): void;

    /**
     * Defines a metadata.
     */
    static defineMetadata(key: object, value: any, target: Newable<any>): void;

    /**
     * Retrieves metadata for target.
     */
    static getMetadata(target: Newable<any>): [ object, any ][];
}

declare namespace NodeJS {
    interface Global {
        MetadataStorage: MetadataStorage,
    }
}
