package week_4;

import java.util.Scanner;

public class MainApp {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        SignUp signup = new SignUp();

        while (true) {
            System.out.println("\nPlease enter 1 for Sign up.");
            System.out.println("\nPlease enter 2 for Display Details.");
            System.out.println("Please enter 3 for Quit.");

            int choice = sc.nextInt();
            sc.nextLine(); 

            if (choice == 1) {
                signup.registerUser();
            } 
            else if (choice==2) {
            	System.out.println("\nPlease enter 2 for Display Detals.");
            	int id = sc.nextInt();
            	signup.displayUser(id);
            }
            
            else if (choice == 3) {
                System.out.println("\nThank you for using the Application.");
                break;
            } else {
                System.out.println("Invalid choice. Try again.");
            }
        }
        	sc.close();   
        }
}