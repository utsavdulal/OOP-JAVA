package week_3;

public class Box {

    double width;
    double height;
    double depth;

    
    Box() {
        width = 10;
        height = 8;
        depth = 12;
        System.out.println("No-arg constructor used. width=10, height=8, depth=12");
    }

    
    Box(double length) {
        width = length;
        height = length;
        depth = length;
        System.out.println("Cube constructor used. All sides = " + length);
    }

    
    Box(double width, double height, double depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        System.out.println("Cuboid constructor used. width=" + width + ", height=" + height + ", depth=" + depth);
    }

    void getVolume() {
        double volume = width * height * depth;
        System.out.println("Volume: " + volume);
    }

    public static void main(String[] args) {

        System.out.println("--- Default Box ---");
        Box defaultBox = new Box();
        defaultBox.getVolume();

        System.out.println("--- Cube ---");
        Box cube = new Box(5);
        cube.getVolume();

        System.out.println("--- Cuboid ---");
        Box cuboid = new Box(4, 6, 8);
        cuboid.getVolume();

    }

}
