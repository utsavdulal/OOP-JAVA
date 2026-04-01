package week_4;

public class Person {
	protected String address;
	
	public Person(String address) {
		this.address = address;
	}
	//this method displays address
	public void showAddress() {
		System.out.println("Address: " + address);
	}
}
