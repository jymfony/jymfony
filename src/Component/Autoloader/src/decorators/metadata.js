export decorator @metadata(key, value) {
    @register((target, prop) => MetadataStorage.defineMetadata(key, value, target, prop))
}
