package week_2;

import java.util.Scanner;

public class q1 {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		System.out.print("Enter the length: ");
		int length = sc.nextInt();
		System.out.print("Enter the breadth: ");
		int breadth = sc.nextInt();
		
		if (length == breadth) {
			System.out.println("It is a square");
		} 
		else {
			System.out.println("It is a rectangle");
			
		}
		sc.close();
	}

}
