declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class LogFormatter {
        formatRemoveService(pass: CompilerPassInterface, id: string, reason: string): string;
        formatInlineService(pass: CompilerPassInterface, id: string, target: string): string;
        formatUpdateReference(pass: CompilerPassInterface, serviceId: string, oldDestId: string, newDestId: string): string;
        formatResolveInheritance(pass: CompilerPassInterface, childId: string, parentId: string): string
        format(pass: CompilerPassInterface, message: string): string;
    }
}
