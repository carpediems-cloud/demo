package demo.java_prg;
import java.util.Scanner;
public class reverse {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a string: ");
        String input = sc.nextLine();
        
        String reversed = new StringBuilder(input).reverse().toString();
        
        System.out.println("Reversed string: " + reversed);
        
        sc.close();
    }
}