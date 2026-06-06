
import java.util.Scanner;
public class armstring {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a string: ");
        String input = sc.nextLine();
        
        int sum = 0;
        for (char ch : input.toCharArray()) {
            sum += (int) ch;
        }
        
        System.out.println("Sum of ASCII values: " + sum);
        
        sc.close();
    }
}