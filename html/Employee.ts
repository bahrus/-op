///<reference path='../node_modules/reflect-metadata/reflect-metadata.d.ts'/>
///<reference path='@op.ts'/>

module Examples{
	
	interface IAddress{
		Street?: string;
		ZipCode?: string;
	}
	
	//@op.initializer(Address.New2)
	class Address implements IAddress{
		
		
		//public static Street = 'Street';
		@op.toProp()
		public Street : string;
		
		//public static ZipCode = 'ZipCode';
		@op.toProp()
		public ZipCode : string;
	}
	
	interface IEmployee{
		Surname?: string;
		FirstName?: string;
		MiddleName?: string;
		HomeAddress?:  IAddress;
	}
	
	
	export class Employee implements IEmployee{
		
		// public static New(employee: IEmployee){
		// 	// const employeeImpl = new Employee();
		// 	// Object['assign'](employeeImpl, employee);
		// 	// return employeeImpl;
		// 	return op.createNew<IEmployee, Employee>(employee, Employee);
		// }
		
		@op.initProp()
		public get Surname() : string{return null;} 
		public set Surname(v: string){}
		
		private _firstName : string;
		
		public get FirstName() : string{
			return this._firstName;
		}
		public set FirstName(val: string){
			this._firstName = val;
		}
		
		//@op.toProp()
		@op.plopIntoMeta<IColumnDefCategory>({
			ColumnDef: {
				hide: true,
			}
		})
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
	}
	
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
	
	var ev = new EmployeeView();
	ev.MiddleName = 'myMiddleName';
	//const evPropIDLookup = Reflect.getMetadata(op.tsp_propIDLookup, ev);
	
	//console.log('evPropIDLookup = ');
	//console.log(evPropIDLookup);
	
	const ev1 = new EmployeeView();
	
	// const uBound = 1000000;
	// const t1 = new Date();
	// for(let i = 0; i < uBound; i++){
	// 	ev1.Surname = 'name_' + i;
	// }
	// const t2 = new Date();
	// for(let i = 0; i < uBound; i++){
	// 	ev1.FirstName = 'name_' + i;
	// }
	// const t3 = new Date();
	// for(let i = 0; i < uBound; i++){
	// 	ev1.MiddleName = 'name_' + i;
	// }
	// const t4 = new Date();
	// console.log('dynamic property: ' + (t2.getTime() - t1.getTime()));
	// console.log('static property ' + (t3.getTime() - t2.getTime()));
	// console.log('static field ' + (t4.getTime() - t3.getTime()));
	//op.describe(ev);
	
	
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
}

