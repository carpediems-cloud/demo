// ============================================================
//  InterfaceDemo.java
//  Demonstrates Java Interfaces: declaration, implementation,
//  multiple interfaces, default/static methods, and polymorphism
// ============================================================

// ─────────────────────────────────────────────
// 1. Basic Interface  –  Shape
// ─────────────────────────────────────────────
interface Shape {
    // Abstract methods (implicitly public & abstract)
    double area();
    double perimeter();

    // Default method (Java 8+) – shared implementation
    default void display() {
        System.out.println("  Shape  : " + getClass().getSimpleName());
        System.out.printf ("  Area   : %.2f%n", area());
        System.out.printf ("  Perim. : %.2f%n", perimeter());
    }

    // Static method (Java 8+) – belongs to the interface itself
    static String category() {
        return "Geometric Shape";
    }
}

// ─────────────────────────────────────────────
// 2. Another Interface  –  Colorable
// ─────────────────────────────────────────────
interface Colorable {
    String getColor();

    default void displayColor() {
        System.out.println("  Color  : " + getColor());
    }
}

// ─────────────────────────────────────────────
// 3. Implementing ONE interface  –  Circle
// ─────────────────────────────────────────────
class Circle implements Shape {
    private double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public double perimeter() {
        return 2 * Math.PI * radius;
    }
}

// ─────────────────────────────────────────────
// 4. Implementing MULTIPLE interfaces  –  Rectangle
// ─────────────────────────────────────────────
class Rectangle implements Shape, Colorable {
    private double length;
    private double width;
    private String color;

    Rectangle(double length, double width, String color) {
        this.length = length;
        this.width  = width;
        this.color  = color;
    }

    @Override
    public double area() {
        return length * width;
    }

    @Override
    public double perimeter() {
        return 2 * (length + width);
    }

    @Override
    public String getColor() {
        return color;
    }
}

// ─────────────────────────────────────────────
// 5. Interface extending another interface
// ─────────────────────────────────────────────
interface Drawable extends Shape {
    void draw();   // additional abstract method
}

class Triangle implements Drawable, Colorable {
    private double a, b, c;   // three sides
    private String color;

    Triangle(double a, double b, double c, String color) {
        this.a     = a;
        this.b     = b;
        this.c     = c;
        this.color = color;
    }

    @Override
    public double area() {
        // Heron's formula
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    @Override
    public double perimeter() {
        return a + b + c;
    }

    @Override
    public void draw() {
        System.out.println("  Drawing a triangle with sides: "
                + a + ", " + b + ", " + c);
    }

    @Override
    public String getColor() {
        return color;
    }
}

// ─────────────────────────────────────────────
// 6. Functional Interface (single abstract method)
//    Used with lambda expressions
// ─────────────────────────────────────────────
@FunctionalInterface
interface Greet {
    void sayHello(String name);
}

// ─────────────────────────────────────────────
// 7. Interface for a real-world example  –  Payment
// ─────────────────────────────────────────────
interface Payment {
    boolean processPayment(double amount);
    String  paymentMethod();

    default void printReceipt(double amount) {
        System.out.printf("  [Receipt] Rs %.2f paid via %s%n",
                amount, paymentMethod());
    }
}

class CreditCardPayment implements Payment {
    private String cardNumber;

    CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    @Override
    public boolean processPayment(double amount) {
        System.out.println("  Processing credit card ending in "
                + cardNumber.substring(cardNumber.length() - 4)
                + " for Rs " + amount);
        return true;   // assume success
    }

    @Override
    public String paymentMethod() {
        return "Credit Card";
    }
}

class UPIPayment implements Payment {
    private String upiId;

    UPIPayment(String upiId) {
        this.upiId = upiId;
    }

    @Override
    public boolean processPayment(double amount) {
        System.out.println("  Sending Rs " + amount + " via UPI to " + upiId);
        return true;
    }

    @Override
    public String paymentMethod() {
        return "UPI";
    }
}

// ─────────────────────────────────────────────
// Main Class
// ─────────────────────────────────────────────
public class InterfaceDemo {

    // Helper  – prints a section banner
    static void banner(String title) {
        System.out.println("\n╔══════════════════════════════════════╗");
        System.out.printf ("║  %-36s║%n", title);
        System.out.println("╚══════════════════════════════════════╝");
    }

    public static void main(String[] args) {

        // ── 1. Basic Interface ──────────────────────────────────
        banner("1. Circle  (implements Shape)");
        Shape circle = new Circle(7.0);
        circle.display();
        System.out.println("  Category: " + Shape.category());   // static method

        // ── 2. Multiple Interfaces ──────────────────────────────
        banner("2. Rectangle (implements Shape + Colorable)");
        Rectangle rect = new Rectangle(10.0, 5.0, "Blue");
        rect.display();
        rect.displayColor();

        // ── 3. Interface Extending Another Interface ────────────
        banner("3. Triangle  (implements Drawable + Colorable)");
        Triangle tri = new Triangle(3, 4, 5, "Red");
        tri.draw();
        tri.display();
        tri.displayColor();

        // ── 4. Polymorphism via Interface Reference ─────────────
        banner("4. Polymorphism – Shape references");
        Shape[] shapes = { new Circle(3), new Rectangle(6, 4, "Green") };
        for (Shape s : shapes) {
            s.display();
            System.out.println();
        }

        // ── 5. Functional Interface with Lambda ─────────────────
        banner("5. Functional Interface + Lambda");
        Greet formal   = name -> System.out.println("  Good day, " + name + "!");
        Greet informal = name -> System.out.println("  Hey " + name + "! 👋");

        formal.sayHello("Mr. Sharma");
        informal.sayHello("Rahul");

        // ── 6. Real-world Payment Interface ─────────────────────
        banner("6. Payment Gateway (interface polymorphism)");
        Payment[] payments = {
            new CreditCardPayment("1234567890123456"),
            new UPIPayment("rahul@upi")
        };

        double amount = 1500.00;
        for (Payment p : payments) {
            if (p.processPayment(amount)) {
                p.printReceipt(amount);
            }
            System.out.println();
        }

        // ── Summary ─────────────────────────────────────────────
        System.out.println("══════════════════════════════════════════");
        System.out.println("  Key Concepts Demonstrated:");
        System.out.println("  ✔ Declaring an interface");
        System.out.println("  ✔ Implementing a single interface");
        System.out.println("  ✔ Implementing multiple interfaces");
        System.out.println("  ✔ Interface extending another interface");
        System.out.println("  ✔ Default & static interface methods");
        System.out.println("  ✔ Functional interface with lambda");
        System.out.println("  ✔ Polymorphism via interface references");
        System.out.println("══════════════════════════════════════════");
    }
}
