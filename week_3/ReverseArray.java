package week_3;

public class ReverseArray {

    public static void main(String[] args) {

        int[] numbers = {10, 20, 30, 40, 50};

        System.out.println("Array in reverse order:");

        int i = numbers.length - 1;

        while (i >= 0) {
            System.out.println(numbers[i]);
            i--;
        }

    }

}
