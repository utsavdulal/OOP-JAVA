package week_6;

public class Qn3 {
    public static void main(String[] args) {

        int[] list1 = {1, 2, 3, 4, 5};
        int n = list1.length;
        int k = 2; 

        int[] result = new int[n];

        for (int i = 0; i < k; i++) {
            result[i] = list1[n - k + i];
        }

        for (int i = 0; i < n - k; i++) {
            result[k + i] = list1[i];
        }

        
        for (int i = 0; i < n; i++) {
            System.out.print(result[i] + " ");
        }
    }
}