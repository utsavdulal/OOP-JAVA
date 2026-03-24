package week_3;

public class BankAccountOverloaded {

    String accountNumber;
    double balance;
    String accountHolderName;
    String accountHolderAddress;

    BankAccountOverloaded() {
        accountNumber = "N/A";
        balance = 0;
        accountHolderName = "Unknown";
        accountHolderAddress = "Unknown";
        System.out.println("Account created with default values.");
    }

    BankAccountOverloaded(String accountHolderName) {
        this.accountHolderName = accountHolderName;
        this.accountNumber = "N/A";
        this.balance = 0;
        this.accountHolderAddress = "Unknown";
        System.out.println("Account created with name only.");
    }

    BankAccountOverloaded(String accountHolderName, double balance) {
        this.accountHolderName = accountHolderName;
        this.balance = balance;
        this.accountNumber = "N/A";
        this.accountHolderAddress = "Unknown";
        System.out.println("Account created with name and balance.");
    }

    BankAccountOverloaded(String accountNumber, double balance, String accountHolderName, String accountHolderAddress) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.accountHolderName = accountHolderName;
        this.accountHolderAddress = accountHolderAddress;
        System.out.println("Account created with all details.");
    }

    void printDetails() {
        System.out.println("Account Number: " + accountNumber);
        System.out.println("Name: " + accountHolderName);
        System.out.println("Address: " + accountHolderAddress);
        System.out.println("Balance: " + balance);
    }

    public static void main(String[] args) {

        System.out.println("--- Account 1: No arguments ---");
        BankAccountOverloaded account1 = new BankAccountOverloaded();
        account1.printDetails();

        System.out.println("--- Account 2: Name only ---");
        BankAccountOverloaded account2 = new BankAccountOverloaded("Ali Khan");
        account2.printDetails();

        System.out.println("--- Account 3: Name and balance ---");
        BankAccountOverloaded account3 = new BankAccountOverloaded("Sara Ahmed", 2500);
        account3.printDetails();

        System.out.println("--- Account 4: All details ---");
        BankAccountOverloaded account4 = new BankAccountOverloaded("PK123456", 8000, "Usman Ali", "45 Garden Road, Lahore");
        account4.printDetails();

    }

}