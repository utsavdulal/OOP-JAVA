package week_1;

public class Q4 {
	public static void main(String[] args) {
		double a = 8, b = 9, c = 10;
		
		double s = (a+b+c)/2;
		double area = Math.sqrt(s * (s-a) * (s-b) * (s-c));
		
		System.out.println("Area of the triangle ="+ area);
		
	}
}
