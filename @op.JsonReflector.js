///<reference path='@op.ts'/>
var op;
(function (op) {
    function generateReflectionJSON(classRef, rootName) {
        var reflectedClass = op.reflect(classRef, true);
        var reflectionObj = {};
        if (reflectedClass.properties) {
            reflectionObj.Properties = {};
            reflectedClass.properties.forEach(function (prop) {
                reflectionObj.Properties[prop.name] = {
                    path: rootName + "." + prop.name,
                    type: op.getTypeString(prop.propertyTypeClassRef),
                };
            });
        }
        return JSON.stringify(reflectionObj);
    }
    op.generateReflectionJSON = generateReflectionJSON;
})(op || (op = {}));
//# sourceMappingURL=@op.JsonReflector.js.map