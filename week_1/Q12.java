package week_1;
import java.util.Scanner;

public class Q12 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        double pi = 3.14159;

        System.out.print("Enter radius: ");
        double radius = scanner.nextDouble();

        double area = pi * radius * radius;

        System.out.println("Area = " + area);
        scanner.close();
    }
}