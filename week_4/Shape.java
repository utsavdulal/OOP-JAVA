package week_4;

//main class called shape
public class Shape {
	//override hune method
	public double getPerimeter() {
		return 0.0;
	}
	public double getArea() {
		return 0.0;
	}
}
//subclass class extend shape
class Circle extends Shape{
	private double radius;
	
	public Circle(double radius) {
		this.radius = radius;
	}
	
	//override the getPerimeter() method
	@Override
	public double getPerimeter() {
		return 2 * Math.PI * radius;
	}
	
	//override the getArea() method
	@Override
	public double getArea() {
		return Math.PI * radius * radius;
	}
}
