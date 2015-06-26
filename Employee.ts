///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='@op.ts'/>



module Examples{
	
	export interface IAddress{
		Street?: string;
		ZipCode?: string;
	}
	
	export class Address implements IAddress{
		
		@op.toProp()
		public Street : string;
		
		@op.toProp()
		public ZipCode : string;
		
	}
	
	
	
	interface IEmployee{
		Surname?: string;
		FirstName?: string;
		MiddleName?: string;
		HomeAddress?:  IAddress;
		
		
	} /*AutoGenerated:*/ class EmployeeImpl{}
	
	export class EmployeeFactory{
		public static get instance(){
			return new Employee();
		}
	}
	
	@op.autoGen("Information about an employee")
	export class Employee implements IEmployee{
		
		// public static New(employee: IEmployee){
		// 	// const employeeImpl = new Employee();
		// 	// Object['assign'](employeeImpl, employee);
		// 	// return employeeImpl;
		// 	return op.createNew<IEmployee, Employee>(employee, Employee);
		// }
		
		
		
		
		@op.plopIntoMeta<IColumnDefCategory>({
			ColumnDef: {
				hide: true,
			}
		})
		public static defaultAddress : Address;
		
		@op.initProp()
		public get Surname() : string{return null;} 
		public set Surname(v: string){}
		
		private _firstName : string;
		
		@op.initProp()
		public get FirstName() : string{
			return this._firstName;
		}
		public set FirstName(val: string){
			this._firstName = val;
		}
		
		@op.plopIntoMeta<IColumnDefCategory>({
			ColumnDef: {
				hide: true,
			}
		})
		@op.description(`Middle Name of Employee`)
		public MiddleName : string;
		
		@op.toProp()
		public HomeAddress : Address;
		
		@op.plopIntoMeta<IColumnDefCategory>({
			ColumnDef: {
				hide: true,
			}
		})
		public DriveHome() : void {
			
		}
		
		@op.reflectionType(Address)
		public TempAddress : IAddress;
		
		
		public findLocation(@op._ emp: Employee, s: string) : boolean{
			return true;
		}
		
	}
	
	// Object.defineProperty(Employee, 'instance', {
    //   get: () =>{
	// 	  return new Employee();
	//   },
    //   enumerable: true,
    //   configurable: true
    // });
	
	console.log('reflect Employee => ');
	console.log(op.reflect(Employee, true));
	
	const ColumnDef = 'ColumnDef';
	interface IColumnDef{
		width?: number;
		hide?: boolean;
		title?: string;
	}
	
	interface IColumnDefCategory{
		ColumnDef: IColumnDef; //TODO:  Replace "ColumnDef" with Symbol?
	}
	
	const Constraints = 'Constraints';
	interface IConstraints{
		maxLength?: number;
	}
	
	interface IConstraintCategory{
		Constraints : IConstraints; //TODO:  Replace "Contraints" with Symbol?
	}
	
	
	const setTitleToFieldNameUC: (fieldName: string) => IColumnDefCategory = function(fieldName: string){
		return {
			ColumnDef: {
				title: fieldName.toUpperCase(),
			}
		}
	}
	
	class AddressView extends Address implements IAddress{
		//@op.toProp()
		@op.plopIntoMeta<IConstraintCategory>({
			Constraints:{
				maxLength: 200
			}
		})
		public street: string;
	}
	
	class EmployeeView extends Employee implements IEmployee{
		@op.plopIntoMeta<IConstraintCategory>({
			Constraints:{
				maxLength: 10
			}
		})
		@op.plopIntoMeta<IColumnDefCategory>({
			ColumnDef: {
				width: 200,
			}
		})
		@op.metaPlopper<IColumnDefCategory>(setTitleToFieldNameUC)
		MiddleName: string;
		
		@op.plopIntoMeta<IColumnDefCategory>({
			ColumnDef: {
				width: 100,
			}
		})
		Surname: string;
		
		@op.toProp()
		HomeAddress: AddressView;
		
	}
	
	console.log('reflect on EmployeeView =>');
	console.log(op.reflect(EmployeeView, true));
	console.log('generate interface =>');
	console.log(op.generateInterface(Employee));
	console.log(op.generateInterfaces(Examples, 'Examples'));
	
	var ev = new EmployeeView();
	ev.MiddleName = 'myMiddleName';

	const ev1 = new EmployeeView();
	
	
	
	
	const person1 = op.createNew<Employee, IEmployee>(Employee, {
		FirstName : 'Bruce',
		MiddleName: 'B',
		Surname: 'Anderson',
		HomeAddress: op.createNew<Address, IAddress>(Address, {
			Street: '1600 Pennsylvania Ave',
			ZipCode: '90210'	
		}),
	});
	
	console.log(person1);
	person1.Surname = 'Bruce';
	console.log(person1.Surname);
	ev1.MiddleName = 'test';
	
	const newEmployee : op.IAssignAction<Employee, IEmployee> = {
		do: op.assign,
		source:{
			FirstName: 'George',
			MiddleName: 'Carl',
		},
		target: EmployeeFactory.instance,
	};
	
	console.log(newEmployee.do().FirstName);
	
	
	
}

