(() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass("Jymfony.Component.VarExporter.Fixtures.ConcreteClass")).newInstanceWithoutConstructor()
        ],
        null,
        {
            "Jymfony.Component.VarExporter.Fixtures.ConcreteClass": {
                ["_foo"]: {
                    ["0"]: 123,
                },
                ["_bar"]: {
                    ["0"]: 234,
                },
            },
        },
        o[0],
        []
    );
})();
