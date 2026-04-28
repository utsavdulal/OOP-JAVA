package week_7;


class Customer {
 protected String firstName;
 protected String lastName;

 public Customer(String firstName, String lastName) {
     this.firstName = firstName;
     this.lastName = lastName;
 }

 public void displayCustomer() {
     System.out.println("Customer: " + firstName + " " + lastName);
 }
}


class Account extends Customer {
 private int accountNumber;
 private double balance;

 public Account(String firstName, String lastName, int accountNumber, double balance) {
     super(firstName, lastName);
     this.accountNumber = accountNumber;
     this.balance = balance;
 }

 public void deposit(double amount) {
     balance += amount;
     System.out.println("Deposited: " + amount);
 }

 public void withdraw(double amount) {
     if (amount <= balance) {
         balance -= amount;
         System.out.println("Withdrawn: " + amount);
     } else {
         System.out.println("Insufficient balance!");
     }
 }

 public double getBalance() {
     return balance;
 }

 public int getAccountNumber() {
     return accountNumber;
 }

 public void displayAccount() {
     displayCustomer();
     System.out.println("Account No: " + accountNumber);
     System.out.println("Balance: " + balance);
 }
}


class Transaction {
 public void transfer(Account fromAccount, Account toAccount, double amount) {
     if (fromAccount.getBalance() >= amount) {
         fromAccount.withdraw(amount);
         toAccount.deposit(amount);
         System.out.println("Transfer successful!");
     } else {
         System.out.println("Transfer failed! Insufficient balance.");
     }
 }
}


public class BankTestQ1 {
 public static void main(String[] args) {
	 
     Account acc1 = new Account("Utsav", "Dulal", 101, 5000);
     Account acc2 = new Account("Hanish", "Kafle", 102, 3000);

     System.out.println("Before Transaction:");
     acc1.displayAccount();
     acc2.displayAccount();

     Transaction t = new Transaction();
     t.transfer(acc1, acc2, 2000);

     System.out.println("\nAfter Transaction:");
     acc1.displayAccount();
     acc2.displayAccount();
 }
}