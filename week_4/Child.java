package week_4;

public class Child extends Parent{
	public void showAccess() {
		//protected variable lai subclass ma direct access garna milxa
		System.out.println("Child access protected FamilyName: " + familyName);
		//public variable lai pani milxa
		System.out.println("Child accesses public country: " + country);
		
		//Private variable direct access garna mildaina but parent ko public method bata variable herna milxa

		showSecretCode();
	}
	public static void main(String[] args) {
		Child childObj = new Child();
		childObj.showAccess();
	}
}
