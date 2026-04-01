package week_4;

public class MainShape {
	public static void main(String[] args) {
		Circle circle = new Circle(5.0);
		
		System.out.println("Circle radius: 5.0");
		System.out.println("Perimeter: " + circle.getPerimeter());
		System.out.println("Area: " + circle.getArea());
	}
}
