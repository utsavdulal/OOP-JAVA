package week_2;

import java.util.Scanner;

public class q9 {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
        System.out.print("Enter n: ");
        int n = sc.nextInt();
        int sum = 0;
        int count = 0; 
        int num = 2;   

        while (count < n) {
            sum += num;
            num += 2;  
            count++;
        }

        System.out.println("Sum of first " + n + " even numbers: " + sum);
        sc.close();
	}

}
