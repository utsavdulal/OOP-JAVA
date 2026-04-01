package week_4;

public class Parent {
	private String secretCode = "Private Sectet Code";
	protected String familyName = "Protected Family Name";
	public String country = "Public Country";
	
	public void showSecretCode() {
		System.out.println("Parent access: " + secretCode);
	}
}
