package week_1;
import java.util.Scanner;

public class Q11 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter distance in miles: ");
        double miles = scanner.nextDouble();

        double km = miles * 1.60934;

        System.out.println("Distance in kilometers = " + km);
        scanner.close();
    }
}