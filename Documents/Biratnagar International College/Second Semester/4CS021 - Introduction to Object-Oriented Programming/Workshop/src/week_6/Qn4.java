package week_6;
import java.util.Collections;

import java.util.LinkedList;

public class Qn4 {
    public static void main(String[] args) {

       
        LinkedList<String> colors = new LinkedList<>();

        
        colors.add("Blue");
        colors.add("Pink");
        colors.add("Green");
        colors.add("Yellow");
        colors.add("Black");

       
        System.out.println("Original List:");
        for (String color : colors) {
            System.out.println(color);
        }

        if (colors.contains("Pink")) {
            System.out.println("\nPink is present in the list.");
        } else {
            System.out.println("\nPink is not present in the list.");
        }

        Collections.shuffle(colors);
        System.out.println("\nAfter Shuffling:");
        for (String color : colors) {
            System.out.println(color);
        }

      
        Collections.sort(colors);
        System.out.println("\nAfter Sorting (Ascending):");
        for (String color : colors) {
            System.out.println(color);
        }
    }
}