#include <iostream>

int main() {
    int num;
    std::cout << "Enter a number: ";
    if (!(std::cin >> num)) {
        std::cout << "Invalid input." << std::endl;
        return 1;
    }
    
    if (num < 0) {
        std::cout << num << " is not a palindrome." << std::endl;
        return 0;
    }
    
    int temp = num;
    long long reversedNum = 0;
    
    while (temp > 0) {
        int digit = temp % 10;
        reversedNum = reversedNum * 10 + digit;
        temp /= 10;
    }
    
    if (num == reversedNum) {
        std::cout << num << " is a palindrome." << std::endl;
    } else {
        std::cout << num << " is not a palindrome." << std::endl;
    }
    
    return 0;
}