package week_1;
import java.util.Scanner;

public class Q8 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter radius: ");
        double radius = scanner.nextDouble();

        System.out.print("Enter height: ");
        double height = scanner.nextDouble();

        double volume = 3.1416 * radius * radius * height;

        System.out.println("Volume of the cylinder is= " + volume);
        scanner.close();
    }
}