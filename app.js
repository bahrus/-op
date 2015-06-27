///<reference path='reflect-metadata.d.ts'/>
///<reference path='@op.ts'/>
///<reference path='@op.JsonReflector.ts'/>
///<reference path='@op.InterfaceGenerators.ts'/>
///<reference path='Employee.ts'/>
if (typeof (global) !== 'undefined') {
    require('./@op.InterfaceGenerators');
    require('./@op.JsonReflector');
    require('./Employee');
}
console.log('Hello world 3');
//console.log(Reflect);
console.log('reflect on EmployeeView =>');
console.log(op.reflect(Examples.EmployeeView, true));
console.log('generate interface =>');
console.log(op.generateInterface(Examples.Employee));
console.log(op.generateInterfaces(Examples, 'Examples'));
var ev = new Examples.EmployeeView();
ev.MiddleName = 'myMiddleName';
var ev1 = new Examples.EmployeeView();
var person1 = op.createNew(Examples.Employee, {
    FirstName: 'Bruce',
    MiddleName: 'B',
    Surname: 'Anderson',
    HomeAddress: op.createNew(Examples.Address, {
        Street: '1600 Pennsylvania Ave',
        ZipCode: '90210'
    }),
});
console.log(person1);
person1.Surname = 'Bruce';
console.log(person1.Surname);
ev1.MiddleName = 'test';
var newEmployee = {
    do: op.assign,
    source: {
        FirstName: 'George',
        MiddleName: 'Carl',
    },
    target: Examples.EmployeeFactory.instance,
};
console.log(newEmployee.do().FirstName);
console.log(op.generateReflectionJSON(Examples.Employee, 'obj'));
//# sourceMappingURL=app.js.map