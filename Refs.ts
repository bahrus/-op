///<reference path='Scripts/typings/node/node.d.ts'/>



if (typeof (global) !== 'undefined') {
    require('./Reflect');
    require('./@op');
    const guid = '@op-81B44259-976C-4DFC-BE00-6E901415FEF3';
    const globalNS = global[guid] || 'op';
    if (!global.refs) {
        global.refs = {
            set moduleTarget(obj) {
                if (!global[globalNS]) global[globalNS] = {};
                for (const key in global.tsp) {
                    if (!obj[key]) obj[key] = global[globalNS][key];
                }
            },
            set ref(arr) {
                global[globalNS][arr[0]] = arr[1];
            }
        };
    }
    // require('./CommonActions');
    // require('./ParserActions');
    // require('./TypeScriptEntities');
    // require('./FileSystemActions');
    // require('./DOMActions');
    // require('./DOMBuildDirectives');
    // require('./NodeJSImplementations');
    // require('./BuildConfig');
    
}