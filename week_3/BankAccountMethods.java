package week_3;

public class BankAccountMethods {

    String accountNumber;
    double balance;
    String accountHolderName;
    String accountHolderAddress;

    void depositMoney(double amount) {
        balance = balance + amount;
        System.out.println("Amount deposited: " + amount);
        System.out.println("Current balance: " + balance);
    }

    void withdrawMoney(double amount) {
        if (amount > balance) {
            System.out.println("Not enough balance!");
        } else {
            balance = balance - amount;
            System.out.println("Amount withdrawn: " + amount);
            System.out.println("Current balance: " + balance);
        }
    }

    public static void main(String[] args) {

        BankAccountMethods myAccount = new BankAccountMethods();

        myAccount.accountNumber = "PK123456";
        myAccount.balance = 5000;
        myAccount.accountHolderName = "Ali Khan";
        myAccount.accountHolderAddress = "123 Main Street, Karachi";

        System.out.println("--- Depositing Money ---");
        myAccount.depositMoney(2000);

        System.out.println("--- Withdrawing Money ---");
        myAccount.withdrawMoney(1000);

        System.out.println("--- Trying to withdraw too much ---");
        myAccount.withdrawMoney(99999);

    }

}
