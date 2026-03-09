package week_1;
import java.util.Scanner;

public class Q9 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter principal: ");
        double principal = scanner.nextDouble();

        System.out.print("Enter rate of interest: ");
        double rate = scanner.nextDouble();

        System.out.print("Enter time: ");
        double time = scanner.nextDouble();

        double interest = (principal * rate * time) / 100;

        System.out.println("Simple Interest = " + interest);
        scanner.close();
    }
}
