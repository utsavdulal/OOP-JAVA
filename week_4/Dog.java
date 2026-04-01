package week_4;

public class Dog extends Animal2 {
	private String breed;
	
	//dog constructor le animal2 call garxa super use garera
	public Dog(String name, String breed) {
		super(name); //yesle animal2 lai call garxa
		this.breed = breed;
	}
	
	//getter
	public String getBreed() {
		return breed;
	}
	
	//main method inside dog class
	public static void main(String[] args) {
		Dog dog1 = new Dog("Buddy", "Golden Retriever");
		Dog dog2 = new Dog("Max", "German Shepherd");
		
		//using the super keyword
		System.out.println("Dog1: Name = " + dog1.getName() + ", Breed = " + dog1.getBreed());
		System.out.println("Dog2: Name = " + dog2.getName() + ", Breed = " + dog2.getBreed());
	}
}
