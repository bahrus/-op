///<reference path='@op.ts'/>
module op {
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
        metaData : object;    
    }
}