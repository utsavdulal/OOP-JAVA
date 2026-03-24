package week_3;

public class BankAccountConstructor {

    String accountNumber;
    double balance;
    String accountHolderName;
    String accountHolderAddress;

    BankAccountConstructor(String accountNumber, double balance, String accountHolderName, String accountHolderAddress) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.accountHolderName = accountHolderName;
        this.accountHolderAddress = accountHolderAddress;
    }

    public static void main(String[] args) {

        BankAccountConstructor myAccount = new BankAccountConstructor("PK123456", 5000, "Ali Khan", "123 Main Street, Karachi");

        System.out.println("Account Number: " + myAccount.accountNumber);
        System.out.println("Account Holder Name: " + myAccount.accountHolderName);
        System.out.println("Account Holder Address: " + myAccount.accountHolderAddress);
        System.out.println("Balance: " + myAccount.balance);

    }

}
