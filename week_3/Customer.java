package week_3;

public class Customer {

    private int customerId;
    private String name;
    private BankAccount bankAccount;

    Customer(int customerId, String name, BankAccount bankAccount) {
        this.customerId = customerId;
        this.name = name;
        this.bankAccount = bankAccount;
    }

    
    public int getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public BankAccount getBankAccount() {
        return bankAccount;
    }

    
    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBankAccount(BankAccount bankAccount) {
        this.bankAccount = bankAccount;
    }

    public static void main(String[] args) {

        BankAccount account1 = new BankAccount("PK111", 3000);
        BankAccount account2 = new BankAccount("PK222", 7000);

        Customer customer1 = new Customer(1, "Ali Khan", account1);
        Customer customer2 = new Customer(2, "Sara Ahmed", account2);

        System.out.println("--- Customer 1 ---");
        System.out.println("ID: " + customer1.getCustomerId());
        System.out.println("Name: " + customer1.getName());
        System.out.println("Account Number: " + customer1.getBankAccount().getAccountNumber());
        System.out.println("Balance: " + customer1.getBankAccount().getBalance());

        System.out.println("--- Customer 2 ---");
        System.out.println("ID: " + customer2.getCustomerId());
        System.out.println("Name: " + customer2.getName());
        System.out.println("Account Number: " + customer2.getBankAccount().getAccountNumber());
        System.out.println("Balance: " + customer2.getBankAccount().getBalance());

        
        customer1.setName("Ali Raza");
        customer1.getBankAccount().setBalance(9000);

        System.out.println("--- Updated Customer 1 ---");
        System.out.println("Name: " + customer1.getName());
        System.out.println("New Balance: " + customer1.getBankAccount().getBalance());

    }

}
