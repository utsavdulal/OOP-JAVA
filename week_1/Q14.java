package week_1;
import java.util.Scanner;

public class Q14 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter amount in dollars: ");
        double dollars = scanner.nextDouble();

        System.out.print("Enter exchange rate: ");
        double rate = scanner.nextDouble();

        double converted = dollars * rate;

        System.out.println("Converted amount = " + converted);
        scanner.close();
    }
}