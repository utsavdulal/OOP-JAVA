package week_1;

public class Q16 {
    public static void main(String[] args) {

        boolean expr1 = (5 > 3);
        boolean expr2 = (8 > 5);
        System.out.println("Logical AND = " + (expr1 && expr2));

        expr1 = (5 > 3);
        expr2 = (2 > 5);
        System.out.println("Logical OR = " + (expr1 || expr2));

        expr1 = (!(5 == 10));
        System.out.println("Logical NOT = " + expr1);
    }
}
