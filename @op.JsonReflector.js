///<reference path='@op.ts'/>
if (typeof (global) !== 'undefined') {
    require('./@op');
}
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
                    metaData: prop.metadata,
                };
            });
        }
        return JSON.stringify(reflectionObj);
    }
    op.generateReflectionJSON = generateReflectionJSON;
    // hook global op
    (function (__global) {
        if (typeof __global.op !== "undefined") {
            if (__global.op !== op) {
                for (var p in op) {
                    __global.op[p] = op[p];
                }
            }
        }
        else {
            __global.op = op;
        }
    })(typeof window !== "undefined" ? window :
        typeof WorkerGlobalScope !== "undefined" ? self :
            typeof global !== "undefined" ? global :
                Function("return this;")());
})(op || (op = {}));
//# sourceMappingURL=@op.JsonReflector.js.map