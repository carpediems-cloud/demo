#include <iostream>

int main() {
    int num;
    std::cout << "Enter a number: ";
    if (!(std::cin >> num)) {
        std::cout << "Invalid input." << std::endl;
        return 1;
    }
    
    if (num < 0) {
        std::cout << num << " is not an Armstrong number." << std::endl;
        return 0;
    }
    
    // Count the number of digits
    int temp = num;
    int n = 0;
    while (temp > 0) {
        n++;
        temp /= 10;
    }
    
    temp = num;
    long long sum = 0;
    while (temp > 0) {
        int digit = temp % 10;
        long long power = 1;
        for (int i = 0; i < n; i++) {
            power *= digit;
        }
        sum += power;
        temp /= 10;
    }
    
    if (sum == num) {
        std::cout << num << " is an Armstrong number." << std::endl;
    } else {
        std::cout << num << " is not an Armstrong number." << std::endl;
    }
    
    return 0;
}