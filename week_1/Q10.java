package week_1;
import java.util.Scanner;

public class Q10 {
	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		
        System.out.print("Enter first number: ");
        int a = scanner.nextInt();

        System.out.print("Enter second number: ");
        int b = scanner.nextInt();

        System.out.println("Addition = " + (a + b));
        System.out.println("Subtraction = " + (a - b));
        System.out.println("Multiplication = " + (a * b));
        System.out.println("Division = " + (a / b));

        scanner.close();
	}
}
