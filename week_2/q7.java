package week_2;

import java.util.Scanner;

public class q7 {
	public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int number = sc.nextInt();

        if (number % 2 == 0) {  
            System.out.println(number + " is Even");
            if (number % 4 == 0) {
                System.out.println(number + " is divisible by 4");
            } else {
                System.out.println(number + " is not divisible by 4");
            }
        } else { 
            System.out.println(number + " is Odd");
            if (number % 7 == 0) {
                System.out.println(number + " is divisible by 7");
            } else {
                System.out.println(number + " is not divisible by 7");
            }
        }

        sc.close();
    }

}
