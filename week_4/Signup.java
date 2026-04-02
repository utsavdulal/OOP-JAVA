package week_4;

import java.util.Scanner;

public class SignUp {
	Scanner sc = new Scanner(System.in);
	
	String[] names = new String[100];
	String[] mobiles = new String[100];
	String[] passwords = new String[100];
	String[] dobs = new String[100];
	
	int count = 0;
	
	public void displayUser(int id) {
    	System.out.println("user detail");
    	System.out.println("Name" + names[id] );
    	System.out.println("Contact Number" + mobiles[id]);
    	System.out.println("Password" + passwords[id]);
    	System.out.println("Date of birth"+ dobs[id]);
    	
    	
    }
	
	public void registerUser() {

	        String name, mobile, password, confirmPassword, dob;

	        while (true) {

	            System.out.print("\nEnter Full Name: ");
	            name = sc.nextLine();

	            if (name.length() <= 4) {
	                System.out.println("Name must be more than 4 characters.");
	                continue;
	            }

	            System.out.print("Enter Mobile Number: ");
	            mobile = sc.nextLine();

	            if (!mobile.matches("0\\d{9}")) {
	                System.out.println("Mobile must be 10 digits and start with 0.");
	                continue;
	            }

	            System.out.print("Enter Password: ");
	            password = sc.nextLine();

	            if (!password.matches("[A-Za-z]+[@&]\\d+")) {
	                System.out.println("Password must be like John@123 or Sam&45.");
	                continue;
	            }

	            System.out.print("Confirm Password: ");
	            confirmPassword = sc.nextLine();

	            if (!password.equals(confirmPassword)) {
	                System.out.println("\nPasswords do not match.");
	                System.out.println("Please start again.");
	                continue;
	            }

	            System.out.print("Enter DOB (DD/MM/YYYY): ");
	            dob = sc.nextLine();

	            if (!dob.matches("\\d{2}/\\d{2}/\\d{4}")) {
	                System.out.println("\nInvalid DOB format.");
	                System.out.println("Please start again.");
	                continue;
	            }

	            int year = Integer.parseInt(dob.substring(6));
	            int currentYear = 2026; 
	            int age = currentYear - year;

	            if (age < 21) {
	                System.out.println("User must be at least 21 years old.");
	                continue;
	            }

	            names[count] = name;
	            mobiles[count] = mobile;
	            passwords[count] = password;
	            dobs[count] = dob;

	            System.out.println("\nYou have successfully signed up." + "Your Id is :" + count);
	            count++;
	            break;
	        }
	    }
	}
