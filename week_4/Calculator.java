package week_4;

class CalculatorDemo {
    // Add two integers
    public int add(int a, int b) {
        return a + b;
    }

    // Add three integers
    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // Add two doubles
    public double add(double a, double b) {
        return a + b;
    }

    // Add three doubles
    public double add(double a, double b, double c) {
        return a + b + c;
    }
}

public class Calculator {
    public static void main(String[] args) {
        CalculatorDemo calc = new CalculatorDemo();

        // Two integers
        System.out.println("5 + 8 = " + calc.add(5, 8));

        // Three integers
        System.out.println("10 + 15 + 20 = " + calc.add(10, 15, 20));

        // Two doubles
        System.out.println("3.5 + 2.7 = " + calc.add(3.5, 2.7));

        // Three doubles
        System.out.println("1.1 + 2.2 + 3.3 = " + calc.add(1.1, 2.2, 3.3));
    }
}
