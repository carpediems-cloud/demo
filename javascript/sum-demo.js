/**
 * JavaScript Sum Demo
 * 
 * Demonstrates basic arithmetic, array reduction, and interactive 
 * console input/output using Node.js.
 */

const readline = require('readline');

/**
 * Calculates the sum of two numbers.
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
function sum(a, b) {
    return a + b;
}

/**
 * Calculates the sum of an array of numbers.
 * @param {number[]} arr 
 * @returns {number}
 */
function sumArray(arr) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Calculates the sum of the first N natural numbers.
 * @param {number} n 
 * @returns {number}
 */
function sumOfN(n) {
    return (n * (n + 1)) / 2;
}

/**
 * Main interactive console application.
 */
function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("=== JavaScript Sum Demo ===");
    console.log("1. Sum of two numbers");
    console.log("2. Sum of an array of numbers");
    console.log("3. Sum of first N natural numbers");

    rl.question("\nChoose an option (1-3): ", (choice) => {
        choice = choice.trim();
        
        if (choice === '1') {
            rl.question("Enter the first number: ", (num1) => {
                rl.question("Enter the second number: ", (num2) => {
                    const val1 = parseFloat(num1);
                    const val2 = parseFloat(num2);
                    
                    if (isNaN(val1) || isNaN(val2)) {
                        console.log("\nError: Please enter valid numbers.");
                    } else {
                        console.log(`\nResult: The sum of ${val1} and ${val2} is: ${sum(val1, val2)}`);
                    }
                    rl.close();
                });
            });
        } else if (choice === '2') {
            rl.question("Enter numbers separated by spaces (e.g., 10 20 30): ", (inputStr) => {
                const numbers = inputStr.trim().split(/\s+/).map(Number);
                
                if (numbers.some(isNaN) || inputStr.trim() === '') {
                    console.log("\nError: Please enter valid numbers.");
                } else {
                    console.log(`\nResult: The sum of [${numbers.join(', ')}] is: ${sumArray(numbers)}`);
                }
                rl.close();
            });
        } else if (choice === '3') {
            rl.question("Enter N (positive integer): ", (nStr) => {
                const n = parseInt(nStr, 10);
                
                if (isNaN(n) || n < 1) {
                    console.log("\nError: Please enter a positive integer.");
                } else {
                    console.log(`\nResult: The sum of the first ${n} natural numbers is: ${sumOfN(n)}`);
                }
                rl.close();
            });
        } else {
            console.log("\nInvalid option. Exiting.");
            rl.close();
        }
    });
}

// Export functions for potential reuse/testing
module.exports = {
    sum,
    sumArray,
    sumOfN
};

// Run the interactive demo if executed directly
if (require.main === module) {
    main();
}
