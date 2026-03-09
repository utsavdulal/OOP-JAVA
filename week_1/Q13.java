package week_1;
import java.util.Scanner;

public class Q13 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter quantity: ");
        int quantity = scanner.nextInt();

        System.out.print("Enter price per item: ");
        double price = scanner.nextDouble();

        double total = quantity * price;

        System.out.println("Total cost = " + total);
        scanner.close();
    }
}