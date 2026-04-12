package week_6;

import java.util.ArrayDeque;

public class ArrDequeueQ7 {
    public static void main(String[] args) {

       
        ArrayDeque<String> printQueue = new ArrayDeque<>();

    
        printQueue.add("Document1");
        printQueue.add("Document2");
        printQueue.add("Document3");

        System.out.println("Queue after adding Document1, Document2, Document3:");
        System.out.println(printQueue);

       
        String removedJob = printQueue.remove();
        System.out.println("\nRemoved (printed) job: " + removedJob);

       
        printQueue.add("Document4");
        printQueue.add("Document5");

        System.out.println("\nQueue after adding Document4 and Document5:");
        System.out.println(printQueue);

      
        System.out.println("\nNext job in queue (peek): " + printQueue.peek());

        
        System.out.println("\nFinal Print Queue:");
        System.out.println(printQueue);
    }
}