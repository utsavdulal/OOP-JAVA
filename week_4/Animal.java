package week_4;

//this is a parent class (animal)
public class Animal {
	String name;
	int age;
	
	//constructor for animal class
	public Animal(String name, int age) {
		this.name = name;
		this.age = age;
	}
}

//animal's subclass called dog
class Dog extends Animal{
	String breed;
	
	//constructor for dog class
	public Dog(String name, int age, String breed) {
		super(name, age);
		this.breed = breed;
	}
	
	void display() {
		System.out.println("Name: " + name);
		System.out.println("Age: " + age);
		System.out.println("Breed " + breed);
	}
}