package week_3;

public class BankAccountBasic {

    String accountNumber;
    double balance;
    String accountHolderName;
    String accountHolderAddress;

    public static void main(String[] args) {

        BankAccountBasic myAccount = new BankAccountBasic();

        myAccount.accountNumber = "PK123456";
        myAccount.balance = 5000;
        myAccount.accountHolderName = "Ali Khan";
        myAccount.accountHolderAddress = "123 Main Street, Karachi";

        System.out.println("Account Number: " + myAccount.accountNumber);
        System.out.println("Account Holder Name: " + myAccount.accountHolderName);
        System.out.println("Account Holder Address: " + myAccount.accountHolderAddress);
        System.out.println("Balance: " + myAccount.balance);

    }

}
