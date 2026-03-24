package week_3;

public class Address {

    private String street;
    private String city;
    private String zipCode;

    // Getters
    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getZipCode() {
        return zipCode;
    }

    // Setters
    public void setStreet(String street) {
        this.street = street;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public static void main(String[] args) {

        Address myAddress = new Address();

        myAddress.setStreet("123 Main Street");
        myAddress.setCity("Karachi");
        myAddress.setZipCode("75500");

        System.out.println("Street: " + myAddress.getStreet());
        System.out.println("City: " + myAddress.getCity());
        System.out.println("Zip Code: " + myAddress.getZipCode());

    }

}
