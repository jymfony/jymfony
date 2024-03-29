/// <reference path="Decorator/Annotation.d.ts" />
/// <reference path="Decorator/Metadata.d.ts" />
/// <reference path="Decorator/Type.d.ts" />
/// <reference path="Exception/ClassNotFoundException.d.ts" />
/// <reference path="Exception/ReflectionException.d.ts" />
/// <reference path="Metadata/MetadataHelper.d.ts" />
/// <reference path="Metadata/MetadataStorage.d.ts" />
/// <reference path="Proxy/ManagedProxy.d.ts" />
/// <reference path="Reflection/ReflectionHelper.d.ts" />
/// <reference path="Autoloader.d.ts" />
/// <reference path="ClassLoader.d.ts" />
/// <reference path="DescriptorStorage.d.ts" />
/// <reference path="Finder.d.ts" />
/// <reference path="globals.d.ts" />
/// <reference path="Namespace.d.ts" />

declare function trampoline(filename: string): any;
export { trampoline };
