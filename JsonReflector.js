///<reference path='@op.ts'/>
if (typeof (global) !== 'undefined') {
    require('./@op');
}
var JsonReflector;
(function (JsonReflector) {
    function generateReflectionJSON(classRef, rootName) {
        var reflectedClass = op.reflect(classRef, true);
        var reflectionObj = {};
        if (reflectedClass.properties) {
            reflectionObj.Properties = {};
            reflectedClass.properties.forEach(function (prop) {
                reflectionObj.Properties[prop.name] = {
                    path: rootName + "." + prop.name,
                    type: op.getTypeString(prop.propertyTypeClassRef),
                    metaData: prop.metadata,
                };
            });
        }
        return JSON.stringify(reflectionObj);
    }
    JsonReflector.generateReflectionJSON = generateReflectionJSON;
    // hook global op
    (function (__global) {
        if (typeof __global.JsonReflector !== "undefined") {
            if (__global.JsonReflector !== JsonReflector) {
                for (var p in JsonReflector) {
                    __global.JsonReflector[p] = JsonReflector[p];
                }
            }
        }
        else {
            __global.JsonReflector = JsonReflector;
        }
    })(typeof window !== "undefined" ? window :
        typeof WorkerGlobalScope !== "undefined" ? self :
            typeof global !== "undefined" ? global :
                Function("return this;")());
})(JsonReflector || (JsonReflector = {}));
//# sourceMappingURL=JsonReflector.js.map