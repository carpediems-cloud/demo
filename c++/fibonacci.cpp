#include <iostream>
#include <cmath>

// Function to check if a number is a perfect square
bool isPerfectSquare(int x) {
    int s = std::sqrt(x);
    return (s * s == x);
}

// A number is Fibonacci if and only if one or both of (5*n^2 + 4) or (5*n^2 - 4) is a perfect square
bool isFibonacci(int n) {
    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}

int main() {
    int n;
    std::cout << "Enter the number of terms for Fibonacci series: ";
    if (!(std::cin >> n) || n <= 0) {
        std::cout << "Invalid input. Please enter a positive integer.\n";
        return 1;
    }

    std::cout << "Fibonacci Series up to " << n << " terms:\n";
    long long t1 = 0, t2 = 1, nextTerm = 0;

    for (int i = 1; i <= n; ++i) {
        if (i == 1) {
            std::cout << t1 << " ";
            continue;
        }
        if (i == 2) {
            std::cout << t2 << " ";
            continue;
        }
        nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;
        std::cout << nextTerm << " ";
    }
    std::cout << "\n\n";

    int num;
    std::cout << "Enter an integer to check if it belongs to the Fibonacci sequence: ";
    if (std::cin >> num) {
        if (isFibonacci(num)) {
            std::cout << num << " is a Fibonacci number.\n";
        } else {
            std::cout << num << " is NOT a Fibonacci number.\n";
        }
    }

    return 0;
}
