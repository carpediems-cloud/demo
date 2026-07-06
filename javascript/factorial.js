/**
 * JavaScript Factorial Demo
 * 
 * Calculates the factorial of a non-negative integer
 * using both iterative and recursive approaches.
 */

const readline = require('readline');

// Recursive function to calculate factorial using BigInt to prevent overflow
function factorialRecursive(n) {
    const bigN = BigInt(n);
    if (bigN <= 1n) {
        return 1n;
    }
    return bigN * factorialRecursive(n - 1);
}

// Iterative function to calculate factorial using BigInt to prevent overflow
function factorialIterative(n) {
    const bigN = BigInt(n);
    let result = 1n;
    for (let i = 2n; i <= bigN; ++i) {
        result *= i;
    }
    return result;
}

function askQuestion(rl, query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        const numStr = await askQuestion(rl, "Enter a non-negative integer: ");
        const num = parseInt(numStr, 10);
        
        if (isNaN(num) || num < 0) {
            console.log("Invalid input! Please enter a non-negative integer.");
            rl.close();
            return;
        }

        console.log(`\nCalculating factorial of ${num}:`);
        console.log(`Iterative result: ${factorialIterative(num).toString()}`);
        console.log(`Recursive result: ${factorialRecursive(num).toString()}`);
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        rl.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    factorialIterative,
    factorialRecursive
};
