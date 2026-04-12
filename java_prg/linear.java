import java.util.Scanner;

public class linear {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter number of elements in array: ");
        int n = scanner.nextInt();
        int[] arr = new int[n];

        System.out.println("Enter " + n + " integers:");
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }

        System.out.print("Enter value to find: ");
        int search = scanner.nextInt();

        int result = linearSearch(arr, search);

        if (result == -1) {
            System.out.println(search + " isn't present in the array.");
        } else {
            System.out.println(search + " is present at location " + (result + 1) + " (index " + result + ").");
        }

        scanner.close();
    }
}
