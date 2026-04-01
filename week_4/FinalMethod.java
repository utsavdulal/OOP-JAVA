// Final method override garna mildaina
class FinalMethod {
    public final void showInfo() {
        System.out.println("This is a final method.");
    }
}

// Subclass le inherit garna sakxa
class SubDemo extends FinalMethod {
    // Override garna khojda error aauxa
    // public void showInfo() { ... }
}

public class FinalMethodDemo {
    public static void main(String[] args) {
        // Final method call
        SubDemo obj = new SubDemo();
        obj.showInfo();

        // Final class object
        FinalClass fc = new FinalClass();
        fc.displayMessage();
    }
}
