///<reference path='@op.ts'/>
if (typeof (global) !== 'undefined') {
    require('./@op');
}

module op {
    
    declare var WorkerGlobalScope : any;
    
    export function generateReflectionJSON(classRef: Function, rootName: string) {
        const reflectedClass = op.reflect(classRef, true);
        const reflectionObj: IReflectionObject = {};
        if (reflectedClass.properties) {
            reflectionObj.Properties = {};
            reflectedClass.properties.forEach(prop => {
                reflectionObj.Properties[prop.name] = {
                    path: `${rootName}.${prop.name}`,
                    type: op.getTypeString(prop.propertyTypeClassRef),
                    metaData: prop.metadata,
                };
            });
        }
        return JSON.stringify(reflectionObj);
    }

    export interface IReflectionObject {
        Properties?: { [key: string]: IPropertyObject };
    }

    export interface IPropertyObject {
        path: string;
        type: string;
        metaData : Object;    
    }
    
    // hook global op
    (function(__global: any) {
        if (typeof __global.op !== "undefined") {
            if (__global.op !== op) {
                for (var p in op) {
                    __global.op[p] = (<any>op)[p];
                }
            }
        }
        else {
            __global.op = op;
        }
    })(
        typeof window !== "undefined" ? window :
            typeof WorkerGlobalScope !== "undefined" ? self :
                typeof global !== "undefined" ? global :
                    Function("return this;")());
}