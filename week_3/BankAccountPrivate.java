package week_3;

public class BankAccountPrivate {

    String accountNumber;
    private double balance;
    String accountHolderName;
    String accountHolderAddress;

    BankAccountPrivate(String accountNumber, double balance, String accountHolderName, String accountHolderAddress) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.accountHolderName = accountHolderName;
        this.accountHolderAddress = accountHolderAddress;
    }

    public double getBalance() {
        return balance;
    }

    public static void main(String[] args) {

        BankAccountPrivate myAccount = new BankAccountPrivate("PK123456", 5000, "Ali Khan", "123 Main Street, Karachi");

        System.out.println("Balance: " + myAccount.getBalance());

    }

}
