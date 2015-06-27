///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='reflect-metadata.d.ts'/>
///<reference path='@op.ts'/>

// if (typeof (global) !== 'undefined') {
//     require('./Refs');
// }
if(typeof(global) !== 'undefined'){
    require('./@op');
}

console.log('Hello world 3');
console.log(Reflect);
console.log(op);




