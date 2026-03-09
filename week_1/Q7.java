package week_1;
import java.util.Scanner;

public class Q7 {
	public static void main(String[] args) {
		
		Scanner scanner = new Scanner(System.in);
		
		System.out.print("Enter the temperature in Celsius: ");
		double celsius = scanner.nextDouble();
		
		double fahrenheit = celsius * 9/5 + 32;
		System.out.println("The temperature in fahrenheit is: " + fahrenheit);
		
		scanner.close();
	}
}
