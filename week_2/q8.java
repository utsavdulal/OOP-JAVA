package week_2;

import java.util.Scanner;

public class q8 {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
        System.out.print("Enter marks in Physics: ");
        int physics = sc.nextInt();
        System.out.print("Enter marks in Chemistry: ");
        int chemistry = sc.nextInt();
        System.out.print("Enter marks in English: ");
        int english = sc.nextInt();
        System.out.print("Enter marks in Mathematics: ");
        int math = sc.nextInt();
        System.out.print("Enter marks in Computer: ");
        int computer = sc.nextInt();

        int total = physics + chemistry + english + math + computer;
        double percentage = (total / 5.0); 

        System.out.println("Percentage: " + percentage + "%");

        if (percentage >= 90) {
            System.out.println("Grade: A");
        } else if (percentage >= 80) {
            System.out.println("Grade: B");
        } else if (percentage >= 70) {
            System.out.println("Grade: C");
        } else if (percentage >= 60) {
            System.out.println("Grade: D");
        } else if (percentage >= 40) {
            System.out.println("Grade: E");
        } else {
            System.out.println("Grade: F");
        }

        sc.close();
	}
}
