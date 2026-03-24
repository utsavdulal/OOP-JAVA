package week_3;

public class SumAverage {

    public static void main(String[] args) {

        double[] numbers = {10.5, 20.3, 30.7, 40.1, 50.4};

        double sum = 0;

        int i = 0;
        while (i < numbers.length) {
            sum = sum + numbers[i];
            i++;
        }

        double average = sum / numbers.length;

        System.out.println("Sum: " + sum);
        System.out.println("Average: " + average);

    }

}
