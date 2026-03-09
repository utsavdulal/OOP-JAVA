package week_1;
import java.util.Scanner;

public class Q6 {
    public static void main(String[] args) {
        
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter the length of one side of the square: ");
        double side = scanner.nextDouble();

        double area = side * side;

        System.out.println("Area of the square = " + area);

        scanner.close();
    }
}