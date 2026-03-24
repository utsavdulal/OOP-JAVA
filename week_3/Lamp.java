package week_3;

public class Lamp {

    boolean isOn;

    void turnOn() {
        isOn = true;
        System.out.println("Lamp is on: " + isOn);
    }

    void turnOff() {
        isOn = false;
        System.out.println("Lamp is on: " + isOn);
    }

    public static void main(String[] args) {

        Lamp myLamp = new Lamp();

        System.out.println("--- Turning lamp on ---");
        myLamp.turnOn();

        System.out.println("--- Turning lamp off ---");
        myLamp.turnOff();

    }

}
