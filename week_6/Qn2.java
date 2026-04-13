package week_6;
import java.util.LinkedList;

public class Qn2 {
	public static void main(String[] args) {
		
		
		  LinkedList<Integer> list = new LinkedList<>();
		  
		  list.add(20);
		  list.add(30);
		  list.add(80);
		  
		  list.addFirst(90);
		  list.addLast(110);
		  
		  if(!list.isEmpty()) {
			  System.out.println("it isn't empty");
			  
		  }else {
			  System.out.println("it is empty");
			  
		  }
		  
		  
		  
		  System.out.println(list);
		  
		  
		
		
		
		
		
		
	}

}
