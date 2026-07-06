#include <iostream>

// Recursive function to calculate factorial
unsigned long long factorialRecursive(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorialRecursive(n - 1);
}

// Iterative function to calculate factorial
unsigned long long factorialIterative(int n) {
    unsigned long long result = 1;
    for (int i = 2; i <= n; ++i) {
        result *= i;
    }
    return result;
}

int main() {
    int num;
    std::cout << "Enter a non-negative integer: ";
    if (!(std::cin >> num) || num < 0) {
        std::cout << "Invalid input! Please enter a non-negative integer.\n";
        return 1;
    }

    // Since factorial grows extremely fast, standard 64-bit integer overflows at 21!
    if (num > 20) {
        std::cout << "Warning: Factorial of " << num << " is too large to fit in a standard 64-bit unsigned integer.\n";
        std::cout << "Max supported input is 20.\n";
        return 1;
    }

    std::cout << "Calculating factorial of " << num << ":\n";
    std::cout << "Iterative result: " << factorialIterative(num) << "\n";
    std::cout << "Recursive result: " << factorialRecursive(num) << "\n";

    return 0;
}
