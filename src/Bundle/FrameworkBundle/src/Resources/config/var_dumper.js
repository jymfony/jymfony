/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

container.register('var_dumper.cloner', Jymfony.Component.VarDumper.Cloner.VarCloner)
    .setPublic(true)
;
