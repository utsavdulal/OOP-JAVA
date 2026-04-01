package week_4;

public class Employee extends Person{
	private String department;
	
	//this constructor is used to call person constructor using super
	public Employee(String address, String department) {
		super(address);
		this.department = department;
	}
	//details show garne mehtod
	public void showDetails() {
		System.out.println("Employee Address: " + address);
		System.out.println("Department: " + department);
	}
	public static void main(String[] args) {
		Employee emp = new Employee("Kathmandu, Nepal", "IT Department");

		emp.showAddress();
		
		emp.showDetails();
	}
}
