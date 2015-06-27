///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='Reflect-metadata.d.ts'/>
if (typeof (global) !== 'undefined') {
    require('./Reflect');
    console.log(Reflect);
    console.log(Reflect.defineMetadata);
    //global.Reflect = Reflect;
    var guid = '@op-81B44259-976C-4DFC-BE00-6E901415FEF3';
    var globalNS = global[guid] || 'op';
    if (!global.refs) {
        global.refs = {
            set moduleTarget(obj) {
                if (!global[globalNS])
                    global[globalNS] = {};
                for (var key in global.tsp) {
                    if (!obj[key])
                        obj[key] = global[globalNS][key];
                }
            },
            set ref(arr) {
                global[globalNS][arr[0]] = arr[1];
            }
        };
    }
}
//# sourceMappingURL=Refs.js.map