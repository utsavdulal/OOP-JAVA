package week_6;

import java.util.Stack;

public class RevSeqQ6 {
    public static void main(String[] args) {

        String sen = "Hello Utsav";

       
        String[] words = sen.split(" ");

        Stack<String> stack = new Stack<>();

        
        for (String word : words) {
            stack.push(word);
        }

       
        String reversedSen = "";
        while (!stack.isEmpty()) {
            reversedSen += stack.pop() + " ";
        }

      
        reversedSen = reversedSen.trim();

   
        System.out.println("Original Sentence: " + sen);
        System.out.println("Reversed Sentence: " + reversedSen);
    }
}