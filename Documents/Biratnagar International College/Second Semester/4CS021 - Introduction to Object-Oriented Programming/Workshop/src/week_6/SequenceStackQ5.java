package week_6;

import java.util.Stack;

public class SequenceStackQ5 {
    public static void main(String[] args) {

      
        Stack<String> tasks = new Stack<>();

        
        tasks.push("Read");
        tasks.push("Write");
        tasks.push("Code");

        System.out.println("Stack after pushing Read, Write, Code:");
        System.out.println(tasks);


        String removedTask = tasks.pop();
        System.out.println("\nPopped task: " + removedTask);


        tasks.push("Debug");
        tasks.push("Test");

        System.out.println("\nStack after pushing Debug and Test:");
        System.out.println(tasks);

        System.out.println("\nTop task (peek): " + tasks.peek());

        
        System.out.println("\nFinal Stack:");
        System.out.println(tasks);
    }
}